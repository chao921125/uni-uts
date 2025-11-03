import { defineStore } from "pinia";
export const useHeightStore = defineStore("height", {
	state: () => ({
		heightStatus: 0,
		heightNav: 0,
		heightBound: 0,
	}),
	actions: {
		setHeightStatus(data) {
			this.heightStatus = data;
		},
		setHeightNav(data) {
			this.heightNav = data;
		},
		setHeightBound(data) {
			this.heightBound = data;
		},
	},
});
