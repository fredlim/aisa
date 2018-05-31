import { Canvas } from '../../Canvas';
import { TorusKnotScene } from './TorusKnotScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new TorusKnotScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
