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
          ext: '.css.liquid'
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
          src: ['*.css.liquid'],
          dest: 'shop/assets'
        }]
      }
    },


    cssbeautifier : {
      files : ['shop/assets/*.css.liquid'],
      options : {
        indent: '  ',
        openbrace: 'end-of-line',
        autosemicolon: true
      }
    },


    shopify: {
      options: {
        api_key: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        password: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        url: 'XXXXXXXXXX.myshopify.com',
        base: 'shop/'
      }
    },


    watch: {
      sass: {
        files: 'src/scss/**/*.scss',
        tasks: ['sass:dist', 'autoprefixer:dist', 'cssbeautifier']
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
    'cssbeautifier',
    'shopify:upload',
    'watch'
  ]);

};