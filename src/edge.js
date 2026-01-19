// 边缘函数入口 - 用于 ESA Pages 部署
// 纯前端应用，边缘函数仅作为入口点，实际由静态资源提供服务
export default async function handler(request, context) {
  // 转发到静态资源，由 ESA Pages 自动处理
  return context.next();
}
