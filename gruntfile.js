module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    stylus: {
      main: {
        options: {
          paths: ['stylesheets'],
          urlfunc: 'embedurl',
          use: [
            require('nib')
          ]
        },
        import: [
          'nib'
        ],
        files: {
          'public/stylesheets/main.css': 'private/stylesheets/main.styl'
        }
      }
    },
    jshint: {
      files: ['*.js', 'private/**/*.js',],
      options: {
        globals: {
            jQuery: true,
           console: true,
            module: true,
          document: true
        }
      }
    },
    watch: {
      app: {
        files: ['./*.js', 'javascripts/*.js', 'private/stylsheets/*.styl'],
        tasks: ['jshint', 'stylus', 'build']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jsjsdoc');

  grunt.registerTask('build', ['stylus']);
  grunt.registerTask('default', ['build', 'jshint', 'watch']);
  
};

