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
          dest: 'theme/assets',
          ext: '.min.css.liquid'
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
          cwd: 'theme/assets',
          src: ['*.css.liquid'],
          dest: 'theme/assets'
        }]
      }
    },


    shopify: {
      options: {
        api_key: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        password: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        url: 'XXXXXXXXXX.myshopify.com',
        base: 'theme/'
      }
    },


    watch: {
      sass: {
        files: 'src/scss/**/*.scss',
        tasks: ['sass:dist', 'autoprefixer:dist']
      },

      shopify: {
        files: ['theme/**/*'],
        tasks: ['shopify'],
        options: {
          interval: 500
        }
      }
    }


  });

  grunt.registerTask('default', [
    'sass:dist',
    'autoprefixer:dist',
    'shopify:upload',
    'watch'
  ]);

};