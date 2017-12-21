var app = {  // 定义目录
    srcPath:'src/',
    buildPath:'build/',
    distPath:'dist/'
}

/*1.引入gulp与gulp插件   使用时，要去下载这些插件*/
var gulp = require('gulp');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var Proxy = require('http-proxy-middleware');
var imagemin = require('gulp-imagemin');
var open = require('open');
var htmlmin = require('gulp-htmlmin');
//重命名
var rename = require('gulp-rename');
//清除旧文件夹
var clean = require('gulp-clean');
//生成zip文件
var zip = require('gulp-zip');
//同步执行任务
var runSequence = require('run-sequence');
var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');

/*把bower下载的前端框架放到我们项目当中*/
gulp.task('lib',function () {
    gulp.src('bower_components/common/*.js')
        .pipe(gulp.dest(app.srcPath+'lib'))
        .pipe(gulp.dest(app.buildPath+'lib'))
        .pipe(gulp.dest(app.distPath+'lib'))
        .pipe(connect.reload()); //当内容发生改变时， 重新加载。
    gulp.src('bower_components/common/*.css')
        .pipe(gulp.dest(app.srcPath+'lib'))
        .pipe(gulp.dest(app.buildPath+'lib'))
        .pipe(gulp.dest(app.distPath+'lib'))
        .pipe(connect.reload()); //当内容发生改变时， 重新加载。
});



/*2.定义任务 把所有html文件移动另一个位置*/
gulp.task('html', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src([app.srcPath+'index.html',app.srcPath+'**/index.html'])
        .pipe(htmlmin(options))
        .pipe(gulp.dest(app.distPath))//gulp.dest 要把文件放到指定的目标位置
        .pipe(connect.reload())

});

/*3.执行任务 通过命令行。gulp 任务名称*/
/*px转rem,暂不需要*/
// gulp.task('pxtorem', function() {
//     var processors = [px2rem({remUnit: 37.5})];
//     return gulp.src('./src/*.css')
//         .pipe(postcss(processors))
//         .pipe(gulp.dest('./dest'));
// });

/*定义编译less任务  下载对应的插件 gulp-less
 * 把less文件转成css放到build
 * */
gulp.task('less',function () {
    gulp.src(app.srcPath+'**/css/index.less')
        .pipe(less())
        .pipe(gulp.dest(app.buildPath))
        .pipe(cssmin())
        .pipe(gulp.dest(app.distPath))
});

/*合并js*/
gulp.task('js',function () {
    gulp.src(app.srcPath+'**/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(app.distPath))
});

/*压缩图片*/
gulp.task('image',function () {
    gulp.src(app.srcPath+'**/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(app.distPath))
});

/*复制src*/
gulp.task('copysrc',function () {
    gulp.src([app.srcPath+'**','!**/css/*.less'])
        .pipe(gulp.dest(app.buildPath))
        .pipe(connect.reload())
});

/*同时执行多个任务 [其它任务的名称]
 * 当前bulid时，会自动把数组当中的所有任务给执行了。
 * */
gulp.task('build',['copysrc','less']);


/*定义server任务
 * 搭建一个服务器。设置运行的构建目录
 * */
gulp.task('server',['build'],function () {
    /*设置服务器*/
    connect.server({
        root:[app.buildPath],//要运行哪个目录
        livereload:true,  //是否热更新。
        port:9966,//端口号
        middleware: function(connect, opt) {
            return [
                Proxy('/test',  {
                    target: 'http://10.0.20.50:5004/api',
                    changeOrigin:true
                }),
                Proxy('/api',  {
                    target: 'http://beta-pay.healthmall.cn',
                    changeOrigin:true
                })

            ]
        }
    })
    /*监听哪些任务*/
    // gulp.watch('bower_components/**/*',['lib']);
    gulp.watch(app.srcPath+'**/*.html',['copysrc']);
    gulp.watch(app.srcPath+'*.html',['copysrc']);
    gulp.watch(app.srcPath+'**/js/*.js',['copysrc']);
    gulp.watch(app.srcPath+'**/images/**/*',['copysrc']);
    gulp.watch(app.srcPath+'**/css/*.less',['less']);

    //通过浏览器把指定的地址 （192.168.60.36:9966）打开。
    open('http://localhost:9966');
    // open('http://beta-payment.healthmall.cn:9966');
});


//删除旧文件夹
gulp.task('clean', function () {
    return gulp.src('*.zip')
        .pipe(clean());
});

// 压缩文件
gulp.task('zip', function () {
    return gulp.src(['dist/**'])
        .pipe(zip('HealthmallPayment.zip'))
        .pipe(gulp.dest(''));
});

/*定义默认任务
 * 直接执行gulp 会调用的任务
 * */
gulp.task('default',['server']);
//发布
gulp.task('dist',['clean', 'image', 'html', 'less', 'js', 'zip']);

// gulp.task('dist', function () {
//     runSequence('clean', 'less', 'html', 'js', 'image', 'zip');
// });


