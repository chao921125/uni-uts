/**
 * 测试接口
 */
import config from "@/api/index.js";
import http from "@/common/plugins/http.js";

const demo = config.testPath + "/demo";

export function testGet() {
	return http.request(demo + "/demo", "GET", null, false, false);
}

export function testPost(params = {}) {
	return http.request(demo + "/demo", "POST", params, false, false);
}
