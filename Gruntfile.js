const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// Function to recursively read HTML files from a directory, limited to 2 levels
function readHtmlFiles(dir, depth = 0, fn) {
  if (depth > 2) return; // Stop if depth exceeds 2 levels

  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    files.forEach(file => {
      const filePath = path.join(dir, file.name);

      if (file.isDirectory()) {
        // Recursively read the directory if within depth limit
        readHtmlFiles(filePath, depth + 1, fn);
      } else if (file.isFile()) {
        const ext = path.extname(file.name);
        const baseName = path.basename(file.name, ext);

        // Process HTML files excluding '.tpl.html' files
        if (ext === '.html' && !baseName.endsWith('.tpl')) {
          // console.log(`Found HTML file: ${filePath}`);
          fn(filePath);
        }
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err);
  }
}

// Function to recursively copy files from source to destination
function copyFiles(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src, { withFileTypes: true });

  files.forEach(file => {
    const srcPath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);

    if (file.isDirectory()) {
      // Recursively copy the directory
      copyFiles(srcPath, destPath);
    } else if (file.isFile()) {
      // Copy the file
      fs.copyFileSync(srcPath, destPath);
      // console.log(`Copied file: ${srcPath} -> ${destPath}`);
    }
  });
}

module.exports =  function (grunt) {
    var task = grunt.task;
    const jscontent = fs.readFileSync('./src/startup.js', 'utf-8');
       // console.log(jscontent);
    const minified =   minify(jscontent);
    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dist: 'build',
        src: 'src',
        // 对build目录进行清理
        clean: {
            main: {
                files: [
                    {
                        src: '<%= dist%>'
                    }
                ]
            }
        },

        kmc: {
            options: {
                // depFilePath: 'map.js',
                comboOnly: false,
                fixModuleName: false,
                // comboMap: true,
                /*
                 * 选项为true的时候，kmc会把src的文件拷贝到dest后再添加模块名。
                 * 为false的时候，会直接在用户配置的src中的文件添加模块名。
                 */
                copyAssets: true,
                packages: [{
                    name: 'APP',
                    path: '<%= src%>',
                    charset: 'utf-8',
                    ignorePackageNameInUri: true
                }, {
                    name: 'UFO',
                    path: '<%= src%>/lib/ufo',
                    charset: 'utf-8',
                    ignorePackageNameInUri: true
                }, {
                    name: 'MUI',
                    path: "<%= src%>/lib/mui",
                    charset: 'utf-8',
                    ignorePackageNameInUri: true
                }]
            },
            main: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= src%>',
                        // src里添加的是主文件，被引用的文件会被自动合并到主文件里
                        src: [
                            'app.js',
                            'data/*.js',
                            'action/HomeConfig.js',

                            'util/ParamUtil.js',

                            'viewport/mods/index.js',

                            'list/mods/index.js',
                            'list/mods/ShowList.js',

                            'products/mods/ProductListWithHeaderAndPosFooter.js',

                            'artisans/mods/ArtisanListWithHeaderAndPosFooter.js',
                            'artisans/mods/ArtisanListWithHeader.js',

                            'artisan/mods/index.js',
                            

                            'order/mods/OrderDetail.js',
                            'order/mods/OrderCancel.js',
                            'order/mods/OrderConfirm.js',
                            'order/mods/OrderCancelSuc.js',

                            'orders/mods/OrderListTabs.js',

                            'comment/mods/Viewport.js',
                            'comment/mods/AddComment.js',
                             
                            'home/mods/index.js',

                            'product/mods/Product.js',
                            'product/mods/BuyConfirmModal.js',
                            'product/mods/ShopAddrModal.js',
                            'product/mods/BuyConfirmModal.js',

                            'login/mods/LoginPanel.js',
                            'login/mods/LoginModal.js',

                            'gyz/mods/Gyz.js',

                           

                            'widget/serviceaddr/SearchAddrModal.js',
                            'widget/serviceaddr/ServiceAddrModal.js',
                            'widget/servicetime/ServiceTimeModal.js',
                            'widget/search/SearchModal.js',
                            'widget/servicecity/ServiceCityModal.js',

                            'other/mods/ServiceAttation.js',
                            'other/mods/UserAgreement.js',

                            'example/mods/ArtisanDetail.js',
                            'example/mods/ArtisanList.js',
                            'example/mods/ArtisanListViewport.js',


                            'red/mods/red.js',
                            'red/mods/redCoupon.js',
                            'red/mods/redFail.js',
                            'red/mods/redShare.js'

                        ],
                        dest: '<%= dist%>'
                    }
                ]
            }
        },

        //sass编译
        sass: {
            dest: {
                files: [{
                    expand: true,
                    cwd: '<%= src%>/resources/scss',
                    src: ['*.scss', '!_*.scss', '!*_.scss', '!share.scss', '!global.scss'],
                    dest: '<%= src%>/resources/style',
                    ext: '.css'
                }]
            }
        },

        //监控
        watch: {
            scripts: {
                files: [
                    '<%= src%>/resources/scss/*.scss',
                    '<%= src%>/lib/ufo/src/resources/**/*.scss'
                ],
                tasks: ['sass']
            }
        },

        /*拷贝*/
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= src%>',
                        src: [
                            'lib/ufo/UFO.js',
                            'lib/mock.min.js',
                            '**/*.html',
                            '!**/*.tpl.html',
                            'resources/images/**/*.*',
                            'resources/style/**/*.css',
                            'resources/svg/**/*.*',
                            '!resources/**/*.css.map',
                            'startup.js'
                        ],
                        dest: '<%= dist%>'
                    }
                ]
            }
        },

        //压缩JS
        uglify: {
            options: {
                banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {//按原文件结构压缩dest文件夹内所有JS文件
                files: [{
                    expand: true,
                    cwd: '<%= dist%>',//dest目录下
                    src: '**/*.js',//所有js文件
                    dest: '<%= dist%>'//输出到此目录下
                }]
            }
        },

        //压缩CSS
        cssmin: {
            options: {
                compatibility: 'ie8', //设置兼容模式 
                noAdvanced: true //取消高级特性 
            },
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= dist%>',//dest目录下
                    src: 'resources/**/*.css',//所有css文件
                    dest: '<%= dist%>'//输出到此目录下
                    //ext: '.min.css'
                }]
            }
        },

        //压缩HTML
        htmlmin: {
            options: {
                removeComments: true,
                removeCommentsFromCDATA: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true
            },
            html: {
                files: [
                    { expand: true, cwd: '<%= dist%>', src: ['**/*.html'], dest: '<%= dist%>' }
                ]
            }
        }


    });
    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-kmc');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('replace', 'replace',  function (type) {
       const jscontent = fs.readFileSync('./build/startup.js', 'utf-8');
       
       readHtmlFiles('./build/', 0, function(file){
           // console.log(file);
           const content = fs.readFileSync(file, 'utf-8')
               .replace('<script src=../startup.js type=text/javascript></script>', `<script type="text/javascript">${jscontent}</script>`);
           fs.writeFileSync(file, content, {});
       });
    });

    grunt.registerTask('copy-imgs', 'copy-imgs', function (type) {
        copyFiles("src/upload", "build/upload");
    });

    grunt.registerTask('build', ['clean', 'sass', 'kmc', 'copy', 'uglify', 'cssmin', 'htmlmin', 'replace', 'copy-imgs']);
    return grunt.registerTask('default', '默认流程', function (type) {
        task.run(['build']);
        // task.run(['clean', 'kmc', 'copy', 'uglify', 'cssmin', 'htmlmin']);
    });
}