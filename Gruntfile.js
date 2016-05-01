module.exports = function (grunt) {
    var task = grunt.task;
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
    // 默认任务
    //grunt.registerTask('default', ['cssmin']);
    grunt.registerTask('build', ['clean', 'sass', 'kmc', 'copy', 'uglify', 'cssmin', 'htmlmin']);
    return grunt.registerTask('default', '默认流程', function (type) {
        task.run(['clean', 'kmc', 'copy', 'uglify', 'cssmin', 'htmlmin']);
    });
}