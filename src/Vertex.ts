import { Color } from './core/Color';
import { Vector4f } from './math/index';
import { TextureCoordinate } from './TextureCoordinate';

export class Vertex {
    public position: Vector4f;
    public projection: Vector4f = new Vector4f(0,0,0);
    public normal: Vector4f;
    public color: Color;
    public textureCoordinate: TextureCoordinate = new TextureCoordinate();
}
