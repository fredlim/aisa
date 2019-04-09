import { Canvas } from '../../Canvas';
import { AbstractCube } from './AbstractCube';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new AbstractCube());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
