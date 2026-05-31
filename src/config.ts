import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "ming's blog",
	subtitle: "听歌|动漫|电影",
	lang: "zh_CN", // 语言代码，例如 `en`、`zh_CN`、`ja` 等。
	themeColor: {
		hue: 250, // 主题色默认色相，范围 0 到 360，例如 red: 0、teal: 200、cyan: 250、pink: 345。
		fixed: false, // 对访客隐藏主题色选择器。
	},
	banner: {
		enable: true,
		src: "https://uapis.cn/api/v1/image/bing-daily?random=true&resolution=1080&format=image", // 相对于 `/src` 目录；如果以 `/` 开头，则相对于 `/public` 目录。
		position: "center", // 等同于 `object-position`，仅支持 `top`、`center`、`bottom`，默认值为 `center`。
		credit: {
			enable: true, // 显示横幅图片的署名文字。
			text: "随拍", // 要显示的署名文字。
			url: "", // 可选，原始作品或作者页面的链接。
		},
	},
	toc: {
		enable: true, // 在文章右侧显示目录。
		depth: 2, // 目录显示的最大标题层级，范围 1 到 3。
	},
	favicon: [
		{
			src: "/favicon/author-avatar-32.png",
			sizes: "32x32",
		},
		{
			src: "/favicon/author-avatar-128.png",
			sizes: "128x128",
		},
		{
			src: "/favicon/author-avatar-180.png",
			sizes: "180x180",
		},
		{
			src: "/favicon/author-avatar-192.png",
			sizes: "192x192",
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "关于",
			url: "/about/",
			children: [
				{
					name: "ming",
					url: "/about/",
				},
				{
					name: "友链",
					url: "/links/",
				},
			],
		},
		{
			name: "GitHub",
			url: "https://github.com/saicaca/fuwari", // 内部链接不应包含 base path，系统会自动补上。
			external: true, // 显示外部链接图标，并在新标签页打开。
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar/author-avatar.png", // 相对于 `/src` 目录；如果以 `/` 开头，则相对于 `/public` 目录。
	name: "局子粥头",
	bio: "纸上得来终觉浅，绝知此事要躬行", // What is learned from books is shallow; to know it thoroughly, one must practice it personally.
	links: [
		{
			name: "哔哩哔哩",
			icon: "bilibili",
			url: "https://space.bilibili.com/",
		},
		{
			name: "CSDN",
			icon: "csdn",
			url: "https://blog.csdn.net/",
		},
		{
			name: "Gitee",
			icon: "gitee", // 对应 `src/assets/svg/gitee.svg`
			url: "https://gitee.com/",
		},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://steamcommunity.com/profiles/76561199561664213/",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/M01Y02W03",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// 注意：部分样式（例如背景色）会被覆盖，详见 `astro.config.mjs`。
	// 请使用深色主题，因为当前博客主题只支持深色背景。
	theme: "github-dark",
};
