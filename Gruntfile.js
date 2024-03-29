module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Remove built directory
		clean: {
			dist: ['build'],
			plugins:['build/**/*.less']
		},

		// Built stylesheets with less
		less: {
			dist: {
				options: {
					compress: true,
					optimization: 3
				},
				src: 'src/less/editIt.less',
				dest: 'build/css/<%= pkg.shortname %>.css'
			},
			plugins: {
				options: {
					compress: true,
					optimization: 3
				},
				files: [
					{
						flatten: false,
						expand: true,
						cwd: 'src/',
						src: ['plug-ins/*/*.less'],
						dest: 'build/',/*
						rename: function(dest, src) {return dest + src.replace('.less','.css');}*/
						ext:".css"

					}
				]
			}
		},

		/* Minify CSS files task*/
		cssmin: {
			options: {
				shorthandCompacting: true,
				roundingPrecision: 2,
				keepBreaks: false,
				sourceMap: true
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'build/css',
					src: ['*.css', '!*.min.css'],
					dest: 'build/css',
					ext: '.min.css'
				}]
			},
			plugins: {
				files: [
					{
						flatten: false,
						expand: true,
						cwd: 'build/',
						src: ['plug-ins/*/*.css', '!plug-ins/*/*.min.css'],
						dest: 'build/',
						ext: ".css"
						/*,
					 rename: function(dest, src) {return dest + src.replace('.css','.min.css');}*/
					}
				]
			}
		},

		/* Copy files task*/
		copy: {
			dist: {
				files: [
					{flatten: true, expand: true, src: ['src/icons-font/editIt/fonts/*'], dest: 'build/css/editIt-icons/'},
					{flatten: true, expand: true, src: ['src/*.html'], dest: 'build/demo/',rename: function(dest, src) {return dest + src.replace('.src','');}},
					{flatten: false, expand: true,cwd: 'src/', src: ['plug-ins/**'], dest: 'build/'},
					{flatten: false, expand: true,cwd: 'src/', src: ['images/**'], dest: 'build/css/'},
					{flatten: true, expand: true, src: ['src/demo.css'], dest: 'build/demo/'},
					{flatten: true, expand: true, src: ['src/i18n.json'], dest: 'build/inc/'}
				]
			}
		},

		/* Concateate javascript files task*/
		concat: {
			options: {
				separator: ';\n\n'
			},
			dist: {
				src: [ 'src/jquery.mb.editIt.src.js', 'src/support/*.js' ],
				dest: 'build/inc/<%= pkg.name %>.js',
				rename: function(dest, src) {return dest + src.replace('.src','');
				}
			}
		},

		/* Minify javascript files task*/
		uglify: {
			pre    : {
				src : [ 'thirdPart/HTMLCleaner.js' ],
				dest: 'src/support/HTMLCleaner.min.js'
			},

			dist: {
				options: {
					sourceMap: true,
					banner: '/*' +
							'<%= pkg.name %>\n' +
							' _ Copyright (c) <%= grunt.template.today("yyyy") %>. <%= pkg.author %>\n' +
							' */\n'
				},
				src : [ 'build/inc/jquery.mb.editIt.js' ],
				dest: 'build/inc/jquery.mb.editIt.min.js'
			},

			plugins: {
				options: {
					sourceMap: true
				},
				files: [
					{
						flatten: false,
						expand: true,
						cwd: 'src/',
						src: ['plug-ins/*/*.js'],
						dest: 'build/',
						rename: function(dest, src) {return dest + src.replace('.js','.min.js');}}
				]
			}
		},

		jsbeautifier : {

			dist: {
				src : ['src/jquery.mb.editIt.src.js', "src/plug-ins/**/*.js"]
			},

			plugins: {
				files: [
					{
						flatten: false,
						expand: true,
						cwd: 'build/',
						src: ['plug-ins/*/**']
					}
				]
			},

			options: {
				html: {
					braceStyle: "collapse",
					indentChar: " ",
					indentScripts: "keep",
					indentSize: 4,
					maxPreserveNewlines: 1,
					preserveNewlines: false,
					unformatted: ["a", "sub", "sup", "b", "i", "u"],
					wrapLineLength: 0
				},
				css: {
					indentChar: " ",
					maxPreserveNewlines: 1,
					preserveNewlines: false,
					indentSize: 4
				},
				js: {
					braceStyle: "collapse",
					breakChainedMethods: false,
					e4x: false,
					evalCode: false,
					indentChar: "\t",
					indentLevel: 0,
					indentSize: 1,
					indentWithTabs: false,
					jslintHappy: false,
					keepArrayIndentation: true,
					keepFunctionIndentation: true,
					maxPreserveNewlines: 2,
					preserveNewlines: true,
					spaceBeforeConditional: false,
					spaceInParen: true,
					unescapeStrings: false,
					wrapLineLength: 0,
					endWithNewline: true
				}
			}
		},

		watch: {
			files: ['src/less/*', 'Gruntfile.js', 'src/*.js', 'src/*.html', 'src/*.css'],
			tasks: ['dist']
		},

		buildnumber: {
			options: {
				field: 'build'
			},
			files  : ['package.json']
		},

		compress: {
			dist: {
				options: {
					archive: '<%= pkg.name %>-<%= grunt.file.readJSON("package.json").build %>.zip'
				},
				src : ['build/**']
			}
		},

		includereplace: {
			dist: {
				options: {
					prefix : '{{ ',
					suffix : ' }}',
					globals: {
						version: '<%= pkg.version %>',
						build: '<%= grunt.file.readJSON("package.json").build %>'
					}
				},
				files  : [
					{src: 'build/inc/*.js', expand: true},
					{src: 'build/*.html', expand: true},
					{src: 'build/css/*.css', expand: true}
				]
			}
		},

		bump: {
			options: {
				files             : ['package.json', 'bower.json'],
				updateConfigs     : [],
				commit            : false,
				commitMessage     : 'Release v%VERSION% stable',
				commitFiles       : ['-a'],
				createTag         : false,
				tagName           : '%VERSION%',
				tagMessage        : 'Version %VERSION%',
				push              : false,
				pushTo            : 'https://github.com/pupunzi/jquery.mb.editIt.git',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
				globalReplace     : true,
				prereleaseName    : 'alpha',
				regExp            : false
			}
		}


	});

	// Load plugins used by this task gruntfile
	/* https://github.com/gruntjs/grunt-contrib-less */

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks("grunt-jsbeautifier");
	grunt.loadNpmTasks('grunt-build-number');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-include-replace');
	grunt.loadNpmTasks('grunt-bump');


	// Task definitions
	grunt.registerTask('dist', ['clean', 'uglify:pre', 'less', 'jsbeautifier', 'concat', 'copy', 'uglify:dist', 'cssmin','includereplace']);
	grunt.registerTask('plugins', ['uglify:plugins', 'less:plugins', 'clean:plugins', 'jsbeautifier:plugins' , 'cssmin:plugins' ]);
	grunt.registerTask('zipfiles', ['buildnumber','includereplace', 'compress']);
	grunt.registerTask('commit', ['default', 'buildnumber','includereplace','bump']);


	grunt.registerTask('default', ['dist', 'plugins']);

};
