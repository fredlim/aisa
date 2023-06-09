const { Example } = require("./webpack-utils/Example");

const examples = [
    new Example('third-person-camera'),
    new Example('abstract-cube'),
    new Example('baked-lighting'),
    new Example('block-fade'),
    new Example('bobs'),
    new Example('bump-map'),
    new Example('bunny'),
    new Example('cinematic-scroller'),
    new Example('cube-tunnel'),
    new Example('cube'),
    new Example('cube-subpixel'),
    new Example('demo').withCustomTemplate('./src/index-demo.html'),
    new Example('distorted-sphere'),
    new Example('dof-balls'),
    new Example('fire'),
    new Example('flood-fill'),
    new Example('frustum-culling'),
    new Example('gears-2'),
    new Example('gears'),
    new Example('hoodlum'),
    new Example('led-plasma'),
    new Example('lens'),
    new Example('md2'),
    new Example('mdl'),
    new Example('metaballs'),
    new Example('metalheadz'),
    new Example('misc'),
    new Example('mode-7'),
    new Example('moving-torus'),
    new Example('other-md2').withCustomEntryPoint('./src/examples/different-md2/Application.ts'),
    new Example('particle-streams'),
    new Example('particle-system'),
    new Example('particle-torus'),
    new Example('pixel-effect'),
    new Example('plane-deformation'),
    new Example('plane-deformation-floor'),
    new Example('plane-deformation-tunnel'),
    new Example('plasma'),
    new Example('platonian'),
    new Example('polar-voxels'),
    new Example('portals'),
    new Example('razor'),
    new Example('rotating-gears'),
    new Example('roto-zoomer'),
    new Example('scrolling-background'),
    new Example('sine-scroller'),
    new Example('starfield'),
    new Example('textured-torus'),
    new Example('titan-effect'),
    new Example('torus-knot-tunnel'),
    new Example('torus-knot'),
    new Example('torus'),
    new Example('toxic-dots'),
    new Example('tunnel'),
    new Example('twister'),
    new Example('voxel-balls'),
    new Example('voxel-landscape-fade'),
    new Example('voxel-landscape'),
    new Example('wavefront-texture'),
    new Example('wavefront'),
    new Example('blender-camera').withCustomEntryPoint('./src/examples/blender-camera-animation/Application.ts'),
    new Example('feedback-radial-blur'),
    new Example('radial-blur'),
    new Example('room'),
    new Example('text-zoomer'),
    new Example('roto-zoom-demo'),
    new Example('psychadelic-plane-deformation'),
    new Example('led-tunnel'),
    new Example('environment-mapping-torus'),
    new Example('environment-mapping-waves'),
    new Example('environment-mapping-cylinder'),
    new Example('glow'),
    new Example('fog'),
    new Example('wavefront-texture2'),
    new Example('mirror'),
    new Example('text-zoom'),
    new Example('bouncing-text'),
    new Example('skybox'),
    new Example('wireframe-cube'),
    new Example('wavefront-texture3'),
    new Example('wavefront-texture4'),
    new Example('xenusion'),
    new Example('textured-cube'),
    new Example('textured-cube-plasma'),
    new Example('particle-waves'),
    new Example('bilinear-zoom'),
    new Example('particle-scroller'),
    new Example('texture-trick'),
];

module.exports = examples;
