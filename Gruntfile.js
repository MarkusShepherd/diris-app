module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build : [ 'dist'],
            temp: [
                'dist/css',
                'dist/js',
                'dist/_*'
            ]
        },
        copy: {
            options: {
                mode: true
            },
            dev: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: [
                        '**/*.html',
                        '**/*.css'
                    ],
                    dest: 'dist'
                }]
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            all: {
                files: [{
                    expand: true,
                    src: [
                        'src/**/*.js'
                    ],
                    rename: function (dest, src) {
                        return src.replace(/^src\//, 'dist/').replace(/\.js$/, '.annotated.js');
                    }
                }]
            }
        },
        bower_concat: {
            all: {
                dest: {
                    'js': 'dist/_lib.js',
                    'css': 'dist/_lib.css'
                },
                include: [
                    'jquery',
                    'angular',
                    'angular-route',
                    'angular-block-ui',
                    'angular-filter',
                    'bootstrap',
                    'bootbox.js',
                    'ng-file-upload'
                ],
                dependencies: {
                    'angular': 'jquery',
                    'angular-block-ui': 'angular',
                    'angular-route': 'angular',
                    'angular-filter': 'angular',
                    'ng-file-upload': 'angular',
                    'bootbox.js': 'bootstrap'
                },
                mainFiles: {
                    'bootstrap': [
                        'dist/js/bootstrap.js',
                        'dist/css/bootstrap.css'
                    ],
                    'angular-block-ui': [
                        'dist/angular-block-ui.js',
                        'dist/angular-block-ui.css'
                    ],
                    'bootbox.js': 'bootbox.js',
                    'ng-file-upload': 'ng-file-upload.min.js'
                }
            }
        },
        concat: {
            dev: {
                files: {
                    'dist/_<%= pkg.name %>.js': [
                        'dist/js/app.annotated.js',
                        'dist/js/schedule.annotated.js',
                        'dist/js/apply.annotated.js',
                        'dist/js/error.annotated.js'
                    ],
                    'dist/_<%= pkg.name %>.css': [
                        'dist/css/jku-theme.min.css',
                        'dist/css/index.css'
                    ]
                }
            }
        },
        uglify: {
            all: {
                options: {
                    mangle: true,
                    compress: true
                },
                files: {
                    'dist/lib.min.js': 'dist/_lib.js',
                    'dist/<%= pkg.name %>.min.js': 'dist/_<%= pkg.name %>.js'
                }
            }
        },
        cssmin: {
            all: {
                files: {
                    'dist/lib.min.css': 'dist/_lib.css',
                    'dist/<%= pkg.name %>.min.css': 'dist/_<%= pkg.name %>.css'
                }
            }
        },
        jshint: {
            all: {
                src: [
                    '*.js',
                    'bin/www',
                    'config/**/*.js',
                    'src/**/*.js'
                ],
                options: {
                    globals: {
                        angular: true
                    }
                }
            }
        },
        jasmine_node: {
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec'
            },
            all: 'test/spec/'
        }
    });

    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-ng-annotate');

    grunt.registerTask('build', ['copy:dev', 'ngAnnotate', 'bower_concat', 'concat', 'uglify', 'cssmin']);
    grunt.registerTask('test', ['jshint', 'jasmine_node']);
    grunt.registerTask('full_build', ['clean:build', 'test', 'build', 'clean:temp']);
    grunt.registerTask('default', ['clean:build', 'build', 'clean:temp']);
};

