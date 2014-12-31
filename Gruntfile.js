module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({


    sass: {
      dist: {
        options: {
          style: 'compressed',
          'sourcemap=none': true // `sourcemap: 'none'` wouldn't work so yah.
        },
        files: [{
          expand: true,
          cwd: 'src/scss/framework',
          src: ['**/*.scss'],
          dest: 'shop/assets',
          ext: '.css'
        }]
      }
    },


    autoprefixer: {
      options: {
        browsers: [
          'last 5 version',
          'safari 6',
          'ie 9',
          'opera 12.1',
          'ios 6',
          'android 4'
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'shop/assets',
          src: ['*.css'],
          dest: 'shop/assets'
        }]
      }
    },


    cssmin: {
      dist: {
        options : {
          advanced: false,
          aggressiveMerging: false,
          keepBreaks: true,
          keepSpecialComments: '*',
          rebase: false,
          shorthandCompacting: false
        },
        files: [{
          expand: true,
          cwd: 'shop/assets',
          src: ['*.css'],
          dest: 'shop/assets'
        }]
      }
    },


    cssbeautifier : {
      files : ['shop/assets/*.css'],
      options : {
        indent: '  ',
        openbrace: 'end-of-line',
        autosemicolon: true
      }
    },


    shopify: {
      options: {
        api_key: '76bf4dc1f4cbdebba23ee7c83ddd65aa',
        password: 'eb35c842d5b2b1d306db0336642e382e',
        url: 'playground-20.myshopify.com',
        base: 'shop/'
      }
    },


    watch: {
      sass: {
        files: 'src/scss/**/*.scss',
        tasks: ['sass:dist', 'autoprefixer:dist', 'cssmin:dist', 'cssbeautifier']
      },

      shopify: {
        files: ['shop/**/*'],
        tasks: ['shopify'],
        options: {
          interval: 1000
        },
      }
    }


  });

  grunt.registerTask('default', [
    'sass:dist',
    'autoprefixer:dist',
    'cssmin:dist',
    'cssbeautifier',
    'shopify:upload',
    'watch'
  ]);

};