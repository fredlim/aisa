import { CullFace } from './CullFace';
import { Framebuffer } from './Framebuffer';
import { Matrix4f, Vector3f } from './math';
import RandomNumberGenerator from './RandomNumberGenerator';
import { AbstractScene } from './scenes/AbstractScene';
import Texture from './Texture';

const metalJson = require('./assets/metalheadz.json');

class SkyBox {

    // TODO: make single textures
    private skybox: {
        back?: Texture,
        down?: Texture,
        front?: Texture,
        left?: Texture,
        right?: Texture,
        up?: Texture
    } = {};


    // move code from framebuffer into draw method!
    public draw(framebuffer: Framebuffer, mv: Matrix4f): void {
        framebuffer.drawSkyBox(mv.getRotation(), this.skybox);
    }

    public init(): Promise<any> {
        return Promise.all([
        this.createTexture(require('./assets/skybox/skybox_back.png'), false).then(
            (texture: Texture) => this.skybox.back = texture
        ),
        this.createTexture(require('./assets/skybox/skybox_down.png'), false).then(
            (texture: Texture) => this.skybox.down = texture
        ),
        this.createTexture(require('./assets/skybox/skybox_front.png'), false).then(
            (texture: Texture) => this.skybox.front = texture
        ),
        this.createTexture(require('./assets/skybox/skybox_left.png'), false).then(
            (texture: Texture) => this.skybox.left = texture
        ),
        this.createTexture(require('./assets/skybox/skybox_right.png'), false).then(
            (texture: Texture) => this.skybox.right = texture
        ),
        this.createTexture(require('./assets/skybox/skybox_up.png'), false).then(
            (texture: Texture) => this.skybox.up = texture
        )]);
    }

    // TODO: make TextureUtils
    public createTexture(path: string, hasAlpha: boolean): Promise<Texture> {
        return new Promise<Texture>((resolve) => {
            const img = new Image();
            img.onload = () => {
                const texture = new Texture();
                texture.texture = this.getImageData(img, hasAlpha);
                texture.width = img.width;
                texture.height = img.height;
                resolve(texture);
            };
            img.onerror = () => resolve();
            img.src = path;
        });
    }

    getImageData(image: HTMLImageElement, withAlpha: boolean = false): Uint32Array {
        let canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        let data = context.getImageData(0, 0, image.width, image.height).data;
        let conv = new Uint32Array(data.length / 4);
        let c = 0;
        for (let i = 0; i < data.length; i += 4) {
            if (withAlpha) {
                conv[c] = (data[i + 3] << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            } else {
                conv[c] = (255 << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            }

            c++;
        }
        return conv;
    }

}
export class MetalHeadzScene extends AbstractScene {

    private metalheadz: Texture;
    private texture11: Texture;
    private texture13: Texture;
    private noise: Texture;
    private dirt: Texture;
    private skyBox: SkyBox;
  
    private blenderObjMetal: any;

    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.BACK);
        this.blenderObjMetal = framebuffer.getBlenderScene(metalJson, false);
        this.skyBox = new SkyBox();
        // TODO:
        // make classes for assets
        // skybox, lens flare, 3d modell

        return Promise.all([
            this.skyBox.init(),
            this.createTexture(require('./assets/metalheadz.png'), false).then(
                (texture: Texture) => this.metalheadz = texture
            ),
            this.createTexture(require('./assets/ring.png'), true).then(
                (texture: Texture) => this.texture11 = texture
            ),
            this.createTexture(require('./assets/bokeh.png'), true).then(
                (texture: Texture) => this.texture13 = texture
            ),
            this.createProceduralTexture4().then(
                (texture: Texture) => this.noise = texture
            ),
            this.createTexture(require('./assets/dirt.png'), true).then(
                (texture: Texture) => this.dirt = texture
            ),
        ]);
    }

    public render(framebuffer: any): void {
        const time: number = Date.now();
        let elapsedTime = 0.2 * time;

        framebuffer.clearDepthBuffer();

        const camera: Matrix4f = this.computeCameraMovement(elapsedTime);
        const mv: Matrix4f = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(7, 7, 7));

        // put skybox here
        this.skyBox.draw(framebuffer, mv);

        framebuffer.clearDepthBuffer();
        framebuffer.setBob(this.metalheadz);
        const scal: number = 1.0;
        for (let j: number = 0; j < this.blenderObjMetal.length; j++) {
            let model: any = this.blenderObjMetal[j];
            framebuffer.drawObjectTexture(model, mv, 244 * scal, 225 * scal, 216 * scal);
        }

        let scale = 20;
        let lensflareScreenSpace = framebuffer.project(camera.getRotation().multiply(new Vector3f(1.1 * scale, 2 * scale, -0.9 * scale)));

        framebuffer.drawLensFlare(lensflareScreenSpace, elapsedTime * 1.2, [
            { tex: this.texture11, scale: 2.3, alpha: 0.5 },
            { tex: this.texture13, scale: 1.6, alpha: 0.25 },
            { tex: this.texture13, scale: 0.7, alpha: 0.22 },
            { tex: this.texture13, scale: -0.4, alpha: 0.22 },
        ], this.dirt);

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }

    public createProceduralTexture4(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture: Texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            const rng: RandomNumberGenerator = new RandomNumberGenerator();
            rng.setSeed(100);

            for (let i: number = 0; i < 256 * 256; i++) {
                const scale: number = rng.getFloat();
                texture.texture[i] = 200 * scale | 255 * scale << 8 | 205 * scale << 16 | 255 << 24;
            }

            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }

    private computeCameraMovement(elapsedTime: number): Matrix4f {
        return Matrix4f.constructTranslationMatrix(0, 0, -134 + (Math.sin(elapsedTime * 0.00007) * 0.5 + 0.5) * 17)
            .multiplyMatrix(
                Matrix4f.constructXRotationMatrix(elapsedTime * 0.0008).multiplyMatrix(
                    Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0009).multiplyMatrix(
                        Matrix4f.constructTranslationMatrix(0, 0, 0)
                    )
                )
            );
    }

}
