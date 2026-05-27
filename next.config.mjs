/** @type {import('next').NextConfig} */
const nextConfig = {
  //开启静态导出(GitHub Pages必须)  
  output: "export",
  //适配你的仓库名/fajian
  basePath: "/fajian",
  assetPrefix: "/fajian/",
  //解决图片路径问题
  trailingSlash:true,
  images:{
    unoptimized:true,
  }
};

export default nextConfig;
