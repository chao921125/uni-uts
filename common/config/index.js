import routerPath from "./routers.js";
import imgPath from "./images.js";
import request from "./request.js";

import color from "./color.js";
import emoji from "./emoji.js";

export default {
	color: color,
	emoji: emoji,
	baseUrl: request.getBaseUrl(),
	httpCode: request.httpCode,
	tokenKey: "user-access-token",
	userKey: "user-info",
	historySearchKey: "local-history-search",
	// 无法动态读取配置，此项作为备选
	appId: "小程序appid",
	secret: "小程序安全码",
	// 路由去需要添加 / 作为根路径
	routePath: routerPath,
	imgPath: imgPath,
};
