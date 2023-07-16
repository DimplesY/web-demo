define(["require", "exports", "unbuild"], function (require, exports, unbuild_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = (0, unbuild_1.defineBuildConfig)({
        entries: [
            {
                builder: 'mkdist',
                input: 'src/',
                format: 'esm',
            },
        ],
        hooks: {
            'build:before': async () => {
                // console.log(build)
            },
        },
        // Generates .d.ts declaration file
        declaration: true,
    });
});
