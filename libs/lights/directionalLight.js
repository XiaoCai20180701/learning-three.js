
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */
/*
///DirectionalLight方法根据设置灯光的颜属性color, 强度属性intensity创建平行光光源.
///DirectionalLight对象的功能函数采用定义构造的函数原型对象来实现.
/// NOTE: SpotLight类型灯光实现了阴影,但是需要在场景中使用MeshLambertMaterial或者MeshPhongMaterial
/// 下面一些注释直接摘抄自:http://www.cnblogs.com/yiyezhai/archive/2012/12/24/2829991.html
/// Example:
/// 		var light = new THREE.SpotLight(0xff0000,1,100,Math.PI /2,5);	//创建灯光对象
/// 		light.position.set(50,50,30);	//设置位置
///			light.castShadow = true;	//开启阴影
///			light.shadowMapWidth = 1024; //阴影贴图宽度设置为1024像素
///			light.shadowMapHeight = 1024; //阴影贴图高度设置为1024像素
///			light.shadowCameraNear = 500;	//阴影的平截头体区域near属性
///			light.shadowCameraFar = 4000;	//阴影的平截头体区域far属性
///			light.shadowCameraFov = 30;	//阴影的平截头体区域fov属性
///			scene.add(lignt);	//加入场景
*/
///<summary>DirectionalLight</summary>
///<param name ="color" type="THREE.Color">灯光的颜色属性</param>
///<param name ="intensity" type="Number">灯光的强度,默认是1</param>
///<returns type="DirectionalLight">返回DirectionalLight,平行光光源.</returns>
THREE.DirectionalLight = function ( color, intensity ) {

    THREE.Light.call( this, color );	//调用Light对象的call方法,将原本属于Light的方法交给当前对象DirectionalLight来使用.

    this.position.set( 0, 1, 0 );		//灯光的位置属性初始化为,0,1,0
    this.target = new THREE.Object3D();	//创建一个目标点对象,目标点对象是一个Object3D对象.

    this.intensity = ( intensity !== undefined ) ? intensity : 1;	//灯光的颜色属性,如果不指定,初始化为1.(光线的密度，默认为1。因为RGB的三个值均在0~255之间，不能反映出光照的强度变化，光照越强，物体表面就更明亮。)

    this.castShadow = false;	//布尔值,默认为false,如果设置为true,对于所有表面都会逐像元地计算其在光照方向上是否被遮挡，这会消耗大量的计算。
    this.onlyShadow = false;	//布尔值，控制是否只产生阴影而不“照亮”物体，默认为false。这种模式也许有什么特殊应用吧。

    //

    this.shadowCameraNear = 50;	//shadowCameraNear属性,正交投影立方体近端,定义一个范围(正交投影立方体),不计算在范围之外的物体的阴影,near默认是50
    this.shadowCameraFar = 5000;	//shadowCameraFar属性,正交投影立方体远端,定义一个范围(正交投影立方体),不计算在范围之外的物体的阴影,far默认是5000

    this.shadowCameraLeft = - 500;	//shadowCameraLeft属性,正交投影立方体左端,定义一个范围(正交投影立方体),不计算在范围之外的物体的阴影,left默认是500
    this.shadowCameraRight = 500;	//shadowCameraRight属性,正交投影立方体右端,定义一个范围(正交投影立方体),不计算在范围之外的物体的阴影,right默认是500
    this.shadowCameraTop = 500;	//shadowCameraTop属性,正交投影立方体上端,定义一个范围(正交投影立方体),不计算在范围之外的物体的阴影,top默认是500
    this.shadowCameraBottom = - 500;	//shadowCameraBottom属性,正交投影立方体下端,定义一个范围(正交投影立方体),不计算在范围之外的物体的阴影,Bottom默认是500

    this.shadowCameraVisible = false;	//shadowCameraVisible设置为true,会在场景中显示灯光的框架,方便调试

    this.shadowBias = 0;	//阴影贴图的偏移,
    this.shadowDarkness = 0.5;	//阴影对物体亮度的影响,默认是0.5

    this.shadowMapWidth = 512; //阴影贴图宽度,单位像素,默认512
    this.shadowMapHeight = 512; //阴影贴图高度,单位像素,默认512

    /*对于平行光，WebGL可以使用级联阴影贴图（或成为平行分割阴影贴图）有很好的阴影质量，特别是远距离观看。
    级联阴影通过分割可视区域逐步部分变大，并使用相同的大小，在每个阴影贴图。结果是物体接近观看者将比更远的物体获得更多的阴影贴图像素。
    对于平行光阴影的质量和性能，阴影的距离是非常重要的。就像阴影级联数，阴影距离可以在质量设置中设置，很容易降低阴影范围，以减少硬件性能消耗。
    在阴影距离结束处，阴影将淡出，更远的物体将没有阴影。大多数情况下在场景中更远地方的阴影不会引人注目！*/

    this.shadowCascade = false;		//阴影级联

    this.shadowCascadeOffset = new THREE.Vector3( 0, 0, - 1000 );	//阴影级联偏移距离
    this.shadowCascadeCount = 2;	//当使用2个阴影级联时，整个阴影距离内，默认被分为两块，靠近观察者较小的块和远处较大的块

    this.shadowCascadeBias = [ 0, 0, 0 ];	//阴影级联偏移数组
    this.shadowCascadeWidth = [ 512, 512, 512 ];	//阴影级联宽度数组
    this.shadowCascadeHeight = [ 512, 512, 512 ];	//阴影级联高度数组

    this.shadowCascadeNearZ = [ - 1.000, 0.990, 0.998 ];	//阴影级联近处
    this.shadowCascadeFarZ  = [  0.990, 0.998, 1.000 ];		//阴影级联远处

    this.shadowCascadeArray = [];	//阴影级联数组

    //TODO: 下面这些完全没弄明白,以后补上详细的注释

    this.shadowMap = null;		//指定阴影贴图,WebGLRenderTarget对象,这里好像很复杂,完全没弄明白,以后补上详细的注释.
    this.shadowMapSize = null;	//阴影图的大小,注意,这里应符合OpenGL中对纹理的要求(2的n次方+2n)
    this.shadowCamera = null;	//阴影贴图相机,THREE.PerspectiveCamera对象,
    this.shadowMatrix = null;	//阴影贴图矩阵

};

/**************************************************************************************
 ****下面是DirectionalLight对象提供的功能函数定义,一部分通过prototype继承自Light方法
 ***************************************************************************************/
THREE.DirectionalLight.prototype = Object.create( THREE.Light.prototype );	//DirectionalLight对象从THREE.Light的原型继承所有属性方法

/*clone方法
///clone方法克隆DirectionalLight对象
*/
///<summary>clone</summary>
///<returns type="SpotLight">返回克隆的DirectionalLight对象</returns>
THREE.DirectionalLight.prototype.clone = function () {

    var light = new THREE.DirectionalLight();

    THREE.Light.prototype.clone.call(this, light);	//调用THREE.Light.clone方法,克隆平行光对象
    //复制当前灯光对象的属性
    light.target = this.target.clone();

    light.intensity = this.intensity;

    light.castShadow = this.castShadow;
    light.onlyShadow = this.onlyShadow;

    //

    light.shadowCameraNear = this.shadowCameraNear;
    light.shadowCameraFar = this.shadowCameraFar;

    light.shadowCameraLeft = this.shadowCameraLeft;
    light.shadowCameraRight = this.shadowCameraRight;
    light.shadowCameraTop = this.shadowCameraTop;
    light.shadowCameraBottom = this.shadowCameraBottom;

    light.shadowCameraVisible = this.shadowCameraVisible;

    light.shadowBias = this.shadowBias;
    light.shadowDarkness = this.shadowDarkness;

    light.shadowMapWidth = this.shadowMapWidth;
    light.shadowMapHeight = this.shadowMapHeight;

    //

    light.shadowCascade = this.shadowCascade;

    light.shadowCascadeOffset.copy(this.shadowCascadeOffset);
    light.shadowCascadeCount = this.shadowCascadeCount;

    light.shadowCascadeBias = this.shadowCascadeBias.slice(0);
    light.shadowCascadeWidth = this.shadowCascadeWidth.slice(0);
    light.shadowCascadeHeight = this.shadowCascadeHeight.slice(0);

    light.shadowCascadeNearZ = this.shadowCascadeNearZ.slice(0);
    light.shadowCascadeFarZ = this.shadowCascadeFarZ.slice(0);

    return light;	//返回克隆的平行光的对象

}