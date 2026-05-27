import type { SearchEngine, Wallpaper, WebsiteGroup } from '../types/navigation';
import { logger } from '../utils/logger';

export const STORAGE_KEYS = {
  websiteGroups: 'websiteGroups',
  backgroundIndex: 'backgroundIndex',
} as const;

export const SEARCH_ENGINES: Record<string, SearchEngine> = {
  baidu: { name: '百度', url: 'https://www.baidu.com/s?wd=', favicon: 'https://www.baidu.com/favicon.ico' },
  google: { name: 'Google', url: 'https://www.google.com/search?q=', favicon: 'https://www.google.com/favicon.ico' },
  bing: { name: '必应', url: 'https://www.bing.com/search?q=', favicon: 'https://www.bing.com/favicon.ico' },
  duckduckgo: { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', favicon: 'https://duckduckgo.com/favicon.ico' },
};

export const DEFAULT_WALLPAPERS: Wallpaper[] = [
  { url: 'https://picsum.photos/1920/1080?random=1', copyright: '自然风景', date: '' },
  { url: 'https://picsum.photos/1920/1080?random=2', copyright: '山脉', date: '' },
  { url: 'https://picsum.photos/1920/1080?random=3', copyright: '湖泊', date: '' },
  { url: 'https://picsum.photos/1920/1080?random=4', copyright: '草原', date: '' },
  { url: 'https://picsum.photos/1920/1080?random=5', copyright: '海滩', date: '' },
  { url: 'https://picsum.photos/1920/1080?random=6', copyright: '森林', date: '' },
  { url: 'https://picsum.photos/1920/1080?random=7', copyright: '城市夜景', date: '' },
  { url: 'https://picsum.photos/1920/1080?random=8', copyright: '星空', date: '' },
  { url: 'https://picsum.photos/1920/1080?random=9', copyright: '沙漠', date: '' },
  { url: 'https://picsum.photos/1920/1080?random=10', copyright: '瀑布', date: '' },
  { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80', copyright: 'Unsplash', date: '' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80', copyright: 'Unsplash', date: '' },
  { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80', copyright: 'Unsplash', date: '' },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80', copyright: 'Unsplash', date: '' },
  { url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80', copyright: 'Unsplash', date: '' },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80', copyright: 'Unsplash', date: '' },
  { url: 'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80', copyright: 'Unsplash', date: '' },
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80', copyright: 'Unsplash', date: '' },
  { url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80', copyright: 'Unsplash', date: '' },
  { url: 'https://images.unsplash.com/photo-1504595406629-049022df9503?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80', copyright: 'Unsplash', date: '' },
  { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80', copyright: 'Unsplash', date: '' },
  { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80', copyright: 'Unsplash', date: '' },
  { url: 'https://images.unsplash.com/photo-1439792675105-701e6a4ab6f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80', copyright: 'Unsplash', date: '' },
  { url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80', copyright: 'Unsplash', date: '' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80', copyright: 'Unsplash', date: '' },
];

export const GROUP_SECTIONS = [
  { id: 'home', name: '主页' },
  { id: 'translate', name: '翻译' },
  { id: 'document', name: '文档' },
  { id: 'plugin', name: '插件' },
  { id: 'tool', name: '工具' },
  { id: 'email', name: '邮箱' },
  { id: 'foreign-ai', name: '国外AI' },
  { id: 'domestic-ai', name: '国内AI' },
  { id: 'video-ai', name: 'AI视频' },
  { id: 'image-ai', name: 'AI图像' },
  { id: 'music-ai', name: 'AI音乐' },
  { id: 'note-ai', name: 'AI笔记' },
  { id: 'design-ai', name: 'AI设计' },
  { id: 'design-image', name: '图片素材' },
  { id: 'design-video', name: '视频素材' },
  { id: 'social', name: '社媒' },
] as const;

export type GroupSectionId = typeof GROUP_SECTIONS[number]['id'];

export const DEFAULT_WEBSITE_GROUPS: WebsiteGroup[] = [
  {
    id: 'group1',
    name: '导航页',
    websites: [
      { id: 'site0', name: '领星ERP', url: 'https://erp.lingxing.com/', icon: 'https://www.google.com/s2/favicons?domain=erp.lingxing.com&sz=64', type: 'home' },
      { id: 'site3', name: '蛙蛙工具', url: 'https://www.iamwawa.cn/', icon: 'https://www.google.com/s2/favicons?domain=iamwawa.cn&sz=64', type: 'home' },
      { id: 'site106', name: 'AMZ123工具', url: 'https://www.amz123.com/minitools', icon: 'https://www.google.com/s2/favicons?domain=amz123.com&sz=64', type: 'home' },
      { id: 'site142', name: 'Alexa', url: 'https://alexa.amazon.com/', icon: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=64', type: 'home' },
      { id: 'site7', name: 'Amazon US', url: 'https://www.amazon.com/', icon: 'https://www.amazon.com/favicon.ico', type: 'home' },
      { id: 'site8', name: 'Amazon CA', url: 'https://www.amazon.ca/', icon: 'https://www.amazon.ca/favicon.ico', type: 'home' },
      { id: 'site135', name: 'Amazon DE', url: 'https://www.amazon.de/', icon: 'https://www.google.com/s2/favicons?domain=amazon.de&sz=64', type: 'home' },
      { id: 'site136', name: 'Amazon UK', url: 'https://www.amazon.co.uk/', icon: 'https://www.google.com/s2/favicons?domain=amazon.co.uk&sz=64', type: 'home' },
      { id: 'site9', name: 'Google 翻译', url: 'https://translate.google.com/?hl=zh-CN&tab=TT&sl=auto&tl=zh-CN&op=translate', icon: 'https://www.google.com/s2/favicons?domain=translate.google.com&sz=64', type: 'translate' },
      { id: 'site10', name: 'DeepL 翻译', url: 'https://www.deepl.com/zh/translator', icon: 'https://www.google.com/s2/favicons?domain=deepl.com&sz=64', type: 'translate' },
      { id: 'site11', name: '有道翻译', url: 'https://fanyi.youdao.com/#/TextTranslate', icon: 'https://www.google.com/s2/favicons?domain=fanyi.youdao.com&sz=64', type: 'translate' },
      { id: 'site12', name: '百度翻译', url: 'https://fanyi.baidu.com/mtpe-individual/transText#/', icon: 'https://fanyi.baidu.com/favicon.ico', type: 'translate' },
      { id: 'site1', name: '记事本', url: 'https://sapphira0313.github.io/Notepad/', icon: 'https://sapphira0313.github.io/Notepad/favicon.ico', type: 'document' },
      { id: 'site2', name: '飞书文档', url: 'https://my.feishu.cn/wiki/FIRuwhnzwizjfKkv5sXcRLldnPc', icon: 'https://www.google.com/s2/favicons?domain=feishu.cn&sz=64', type: 'document' },
      { id: 'site84', name: '谷歌文档', url: 'https://docs.google.com/document/', icon: 'https://www.google.com/s2/favicons?domain=docs.google.com&sz=64', type: 'document' },
      { id: 'site85', name: 'Word', url: 'https://www.office.com/launch/word', icon: 'https://www.google.com/s2/favicons?domain=office.com&sz=64', type: 'document' },
      { id: 'site86', name: 'Notion', url: 'https://www.notion.so/', icon: 'https://www.google.com/s2/favicons?domain=notion.so&sz=64', type: 'document' },
      { id: 'site88', name: '企业微信文档', url: 'https://doc.weixin.qq.com/home/recent', icon: 'https://www.google.com/s2/favicons?domain=weixin.qq.com&sz=64', type: 'document' },
      { id: 'site89', name: '石墨文档', url: 'https://shimo.im/', icon: 'https://www.google.com/s2/favicons?domain=shimo.im&sz=64', type: 'document' },
      { id: 'site90', name: 'WPS 云文档', url: 'https://www.wps.cn/', icon: 'https://www.google.com/s2/favicons?domain=wps.cn&sz=64', type: 'document' },
      { id: 'site109', name: 'NotebookLM', url: 'https://notebooklm.google.com/', icon: 'https://www.google.com/s2/favicons?domain=notebooklm.google.com&sz=64', type: 'document' },
      { id: 'site6', name: '微软 ToDo', url: 'https://to-do.live.com/tasks/', icon: 'https://www.google.com/s2/favicons?domain=live.com&sz=64', type: 'document' },
      { id: 'site13', name: '卖家精灵', url: 'https://www.sellersprite.com/', icon: 'https://www.google.com/s2/favicons?domain=sellersprite.com&sz=64', type: 'plugin' },
      { id: 'site14', name: '西柚找词', url: 'https://www.xiyouzhaoci.com/', icon: 'https://www.google.com/s2/favicons?domain=xiyouzhaoci.com&sz=64', type: 'plugin' },
      { id: 'site15', name: 'SIF 关键词', url: 'https://new.sif.com/reverse?country=US', icon: 'https://www.google.com/s2/favicons?domain=sif.com&sz=64', type: 'plugin' },
      { id: 'site16', name: 'Amz123', url: 'https://www.amz123.com/', icon: 'https://www.google.com/s2/favicons?domain=amz123.com&sz=64', type: 'plugin' },
      { id: 'site17', name: '知无不言', url: 'https://www.wearesellers.com/', icon: 'https://www.google.com/s2/favicons?domain=wearesellers.com&sz=64', type: 'plugin' },
      { id: 'site18', name: '雨果网', url: 'https://www.cifnews.com/', icon: 'https://www.google.com/s2/favicons?domain=cifnews.com&sz=64', type: 'plugin' },
      { id: 'site19', name: '智汇网', url: 'https://www.trafficwiser.com/', icon: 'https://www.google.com/s2/favicons?domain=trafficwiser.com&sz=64', type: 'plugin' },
      { id: 'site24', name: 'GitHub', url: 'https://github.com/', icon: 'https://github.com/favicon.ico', type: 'tool' },
      { id: 'site141', name: 'Cloudflare Pages', url: 'https://pages.cloudflare.com/', icon: 'https://www.cloudflare.com/favicon.ico', type: 'tool' },
      { id: 'site26', name: '阿里图标', url: 'https://www.iconfont.cn/', icon: 'https://www.google.com/s2/favicons?domain=iconfont.cn&sz=64', type: 'tool' },
      { id: 'site27', name: 'iTab', url: 'https://go.itab.link/', icon: 'https://www.google.com/s2/favicons?domain=itab.link&sz=64', type: 'tool' },
      { id: 'site28', name: '17TRACK', url: 'https://www.17track.net/zh-cn', icon: 'https://www.google.com/s2/favicons?domain=17track.net&sz=64', type: 'tool' },
      { id: 'site91', name: 'Emoji 大全', url: 'https://www.emojiall.com/zh-hans', icon: 'https://www.google.com/s2/favicons?domain=emojiall.com&sz=64', type: 'tool' },
      { id: 'site107', name: '文字加粗', url: 'https://lingojam.com/BoldTextGenerator', icon: 'https://www.google.com/s2/favicons?domain=lingojam.com&sz=64', type: 'tool' },
      { id: 'site108', name: 'Xmind', url: 'https://app.xmind.com/home/recents/_kzvaq_RCqRTZncew', icon: 'https://www.google.com/s2/favicons?domain=xmind.com&sz=64', type: 'tool' },
      { id: 'site29', name: 'Gmail', url: 'https://mail.google.com/', icon: 'https://www.google.com/s2/favicons?domain=mail.google.com&sz=64', type: 'email' },
      { id: 'site30', name: 'Outlook', url: 'https://outlook.live.com/mail/', icon: 'https://www.google.com/s2/favicons?domain=live.com&sz=64', type: 'email' },
      { id: 'site82', name: '网易邮箱', url: 'https://mail.163.com/', icon: 'https://www.google.com/s2/favicons?domain=mail.163.com&sz=64', type: 'email' },
      { id: 'site20', name: 'Gemini', url: 'https://gemini.google.com/app', icon: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=64', type: 'foreign-ai' },
      { id: 'site23', name: 'ChatGPT', url: 'https://chatgpt.com/', icon: 'https://chatgpt.com/favicon.ico', type: 'foreign-ai' },
      { id: 'site31', name: 'Claude', url: 'https://claude.ai', icon: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=64', type: 'foreign-ai' },
      { id: 'site32', name: 'Llama', url: 'https://www.meta.ai', icon: 'https://www.google.com/s2/favicons?domain=meta.ai&sz=64', type: 'foreign-ai' },
      { id: 'site33', name: 'Grok', url: 'https://grok.com', icon: 'https://www.google.com/s2/favicons?domain=grok.com&sz=64', type: 'foreign-ai' },
      { id: 'site21', name: '豆包', url: 'https://www.doubao.com/chat', icon: 'https://www.google.com/s2/favicons?domain=doubao.com&sz=64', type: 'domestic-ai' },
      { id: 'site22', name: 'DeepSeek', url: 'https://chat.deepseek.com/', icon: 'https://www.google.com/s2/favicons?domain=deepseek.com&sz=64', type: 'domestic-ai' },
      { id: 'site34', name: '通义千问', url: 'https://qianwen.aliyun.com', icon: 'https://www.google.com/s2/favicons?domain=qianwen.aliyun.com&sz=64', type: 'domestic-ai' },
      { id: 'site35', name: 'Kimi', url: 'https://kimi.com', icon: 'https://www.google.com/s2/favicons?domain=kimi.com&sz=64', type: 'domestic-ai' },
      { id: 'site36', name: 'ChatGLM', url: 'https://chat.z.ai/', icon: 'https://www.google.com/s2/favicons?domain=z.ai&sz=64', type: 'domestic-ai' },
      { id: 'site37', name: 'MiniMax', url: 'https://agent.minimax.io/', icon: 'https://www.google.com/s2/favicons?domain=minimax.io&sz=64', type: 'domestic-ai' },
      { id: 'site110', name: 'Sora 2', url: 'https://sora.com', icon: 'https://www.google.com/s2/favicons?domain=sora.com&sz=64', type: 'video-ai' },
      { id: 'site111', name: '可灵 2.0', url: 'https://kling.kuaishou.com', icon: 'https://www.google.com/s2/favicons?domain=kling.kuaishou.com&sz=64', type: 'video-ai' },
      { id: 'site112', name: 'Runway Gen-4', url: 'https://runwayml.com', icon: 'https://www.google.com/s2/favicons?domain=runwayml.com&sz=64', type: 'video-ai' },
      { id: 'site113', name: '即梦AI', url: 'https://jimeng.jianying.com', icon: 'https://www.google.com/s2/favicons?domain=jimeng.jianying.com&sz=64', type: 'video-ai' },
      { id: 'site114', name: '通义万相 2.2', url: 'https://tongyi.aliyun.com/wan/', icon: 'https://www.google.com/s2/favicons?domain=tongyi.aliyun.com&sz=64', type: 'video-ai' },
      { id: 'site115', name: 'GPT Image 1.5', url: 'https://chat.openai.com', icon: 'https://www.google.com/s2/favicons?domain=openai.com&sz=64', type: 'image-ai' },
      { id: 'site116', name: 'Nano Banana Pro', url: 'https://nanobananai.pro', icon: 'https://www.google.com/s2/favicons?domain=nanobananai.pro&sz=64', type: 'image-ai' },
      { id: 'site117', name: 'MidJourney', url: 'https://www.midjourney.com', icon: 'https://www.google.com/s2/favicons?domain=midjourney.com&sz=64', type: 'image-ai' },
      { id: 'site118', name: '文心一格', url: 'https://yiyan.baidu.com', icon: 'https://www.google.com/s2/favicons?domain=yiyan.baidu.com&sz=64', type: 'image-ai' },
      { id: 'site119', name: '通义万相', url: 'https://tongyi.aliyun.com/wan/', icon: 'https://www.google.com/s2/favicons?domain=tongyi.aliyun.com&sz=64', type: 'image-ai' },
      { id: 'site120', name: 'Ideogram', url: 'https://ideogram.ai', icon: 'https://www.google.com/s2/favicons?domain=ideogram.ai&sz=64', type: 'image-ai' },
      { id: 'site121', name: 'Dreamina', url: 'https://jimeng.jianying.com', icon: 'https://www.google.com/s2/favicons?domain=jimeng.jianying.com&sz=64', type: 'image-ai' },
      { id: 'site122', name: 'Suno AI', url: 'https://suno.ai', icon: 'https://www.google.com/s2/favicons?domain=suno.ai&sz=64', type: 'music-ai' },
      { id: 'site123', name: 'Udio', url: 'https://udio.com', icon: 'https://www.google.com/s2/favicons?domain=udio.com&sz=64', type: 'music-ai' },
      { id: 'site124', name: 'Stable Audio 2.0', url: 'https://stability.ai/stable-audio', icon: 'https://www.google.com/s2/favicons?domain=stability.ai&sz=64', type: 'music-ai' },
      { id: 'site125', name: 'AIVA', url: 'https://www.aiva.ai', icon: 'https://www.google.com/s2/favicons?domain=aiva.ai&sz=64', type: 'music-ai' },
      { id: 'site127', name: '腾讯文档AI', url: 'https://docs.qq.com', icon: 'https://www.google.com/s2/favicons?domain=docs.qq.com&sz=64', type: 'note-ai' },
      { id: 'site128', name: '飞书MyAI', url: 'https://www.feishu.cn', icon: 'https://www.google.com/s2/favicons?domain=feishu.cn&sz=64', type: 'note-ai' },
      { id: 'site129', name: '钉钉AI', url: 'https://www.dingtalk.com', icon: 'https://www.google.com/s2/favicons?domain=dingtalk.com&sz=64', type: 'note-ai' },
      { id: 'site130', name: 'Figma AI', url: 'https://www.figma.com', icon: 'https://www.google.com/s2/favicons?domain=figma.com&sz=64', type: 'design-ai' },
      { id: 'site131', name: 'Figma Weave', url: 'https://www.figma.com', icon: 'https://www.google.com/s2/favicons?domain=figma.com&sz=64', type: 'design-ai' },
      { id: 'site132', name: 'Adobe Firefly', url: 'https://firefly.adobe.com', icon: 'https://www.google.com/s2/favicons?domain=firefly.adobe.com&sz=64', type: 'design-ai' },
      { id: 'site133', name: 'Canva Magic Studio', url: 'https://www.canva.com', icon: 'https://www.google.com/s2/favicons?domain=canva.com&sz=64', type: 'design-ai' },
      { id: 'site134', name: 'Leonardo.ai', url: 'https://leonardo.ai', icon: 'https://www.google.com/s2/favicons?domain=leonardo.ai&sz=64', type: 'design-ai' },
      { id: 'site38', name: 'Unsplash', url: 'https://unsplash.com/', icon: 'https://www.google.com/s2/favicons?domain=unsplash.com&sz=64', type: 'design-image' },
      { id: 'site39', name: 'Pexels', url: 'https://www.pexels.com/', icon: 'https://www.google.com/s2/favicons?domain=pexels.com&sz=64', type: 'design-image' },
      { id: 'site40', name: 'Pixabay', url: 'https://pixabay.com/', icon: 'https://www.google.com/s2/favicons?domain=pixabay.com&sz=64', type: 'design-image' },
      { id: 'site41', name: 'Freepik', url: 'https://www.freepik.com/', icon: 'https://www.google.com/s2/favicons?domain=freepik.com&sz=64', type: 'design-image' },
      { id: 'site42', name: 'Burst', url: 'https://burst.shopify.com/', icon: 'https://www.google.com/s2/favicons?domain=shopify.com&sz=64', type: 'design-image' },
      { id: 'site43', name: 'Kaboompics', url: 'https://kaboompics.com/', icon: 'https://www.google.com/s2/favicons?domain=kaboompics.com&sz=64', type: 'design-image' },
      { id: 'site44', name: 'Gratisography', url: 'https://gratisography.com/', icon: 'https://www.google.com/s2/favicons?domain=gratisography.com&sz=64', type: 'design-image' },
      { id: 'site45', name: 'StockSnap', url: 'https://stocksnap.io/', icon: 'https://www.google.com/s2/favicons?domain=stocksnap.io&sz=64', type: 'design-image' },
      { id: 'site46', name: 'ISO Republic', url: 'https://isorepublic.com/', icon: 'https://www.google.com/s2/favicons?domain=isorepublic.com&sz=64', type: 'design-image' },
      { id: 'site48', name: '觅元素', url: 'https://www.51yuansu.com/', icon: 'https://www.google.com/s2/favicons?domain=51yuansu.com&sz=64', type: 'design-image' },
      { id: 'site50', name: '爱制作素材网', url: 'https://www.aizhizuo.com/', icon: 'https://www.google.com/s2/favicons?domain=aizhizuo.com&sz=64', type: 'design-image' },
      { id: 'site51', name: '壹图网', url: 'https://www.1tu.com/', icon: 'https://www.google.com/s2/favicons?domain=1tu.com&sz=64', type: 'design-image' },
      { id: 'site52', name: '汇图网', url: 'https://www.huitu.com/', icon: 'https://www.google.com/s2/favicons?domain=huitu.com&sz=64', type: 'design-image' },
      { id: 'site53', name: 'Shutterstock', url: 'https://www.shutterstock.com/', icon: 'https://www.google.com/s2/favicons?domain=shutterstock.com&sz=64', type: 'design-image' },
      { id: 'site54', name: 'Adobe Stock', url: 'https://stock.adobe.com/', icon: 'https://www.google.com/s2/favicons?domain=adobe.com&sz=64', type: 'design-image' },
      { id: 'site55', name: 'Getty Images', url: 'https://www.gettyimages.com/', icon: 'https://www.google.com/s2/favicons?domain=gettyimages.com&sz=64', type: 'design-image' },
      { id: 'site56', name: 'Depositphotos', url: 'https://www.depositphotos.com/', icon: 'https://www.google.com/s2/favicons?domain=depositphotos.com&sz=64', type: 'design-image' },
      { id: 'site57', name: 'iStockphoto', url: 'https://www.istockphoto.com/', icon: 'https://www.google.com/s2/favicons?domain=istockphoto.com&sz=64', type: 'design-image' },
      { id: 'site58', name: '全景创意', url: 'https://www.quanjing.com/', icon: 'https://www.google.com/s2/favicons?domain=quanjing.com&sz=64', type: 'design-image' },
      { id: 'site59', name: '123RF', url: 'https://www.123rf.com/', icon: 'https://www.google.com/s2/favicons?domain=123rf.com&sz=64', type: 'design-image' },
      { id: 'site60', name: 'Dreamstime', url: 'https://www.dreamstime.com/', icon: 'https://www.google.com/s2/favicons?domain=dreamstime.com&sz=64', type: 'design-image' },
      { id: 'site61', name: '拍信', url: 'https://www.paixin.com/', icon: 'https://www.google.com/s2/favicons?domain=paixin.com&sz=64', type: 'design-image' },
      { id: 'site62', name: 'Yandex Images', url: 'https://yandex.com/images/', icon: 'https://www.google.com/s2/favicons?domain=yandex.com&sz=64', type: 'design-image' },
      { id: 'site63', name: 'Pexels Videos', url: 'https://www.pexels.com/videos/', icon: 'https://www.google.com/s2/favicons?domain=pexels.com&sz=64', type: 'design-video' },
      { id: 'site64', name: 'Pixabay Videos', url: 'https://pixabay.com/videos/', icon: 'https://www.google.com/s2/favicons?domain=pixabay.com&sz=64', type: 'design-video' },
      { id: 'site65', name: 'Mixkit', url: 'https://mixkit.co/', icon: 'https://www.google.com/s2/favicons?domain=mixkit.co&sz=64', type: 'design-video' },
      { id: 'site66', name: 'Coverr', url: 'https://coverr.co/', icon: 'https://www.google.com/s2/favicons?domain=coverr.co&sz=64', type: 'design-video' },
      { id: 'site67', name: 'Videvo', url: 'https://www.videvo.net/', icon: 'https://www.google.com/s2/favicons?domain=videvo.net&sz=64', type: 'design-video' },
      { id: 'site68', name: 'Mazwai', url: 'https://mazwai.com/', icon: 'https://www.google.com/s2/favicons?domain=mazwai.com&sz=64', type: 'design-video' },
      { id: 'site69', name: 'Ignite Motion', url: 'https://ignitemotion.com/', icon: 'https://www.google.com/s2/favicons?domain=ignitemotion.com&sz=64', type: 'design-video' },
      { id: 'site70', name: 'Splitshire', url: 'https://www.splitshire.com/', icon: 'https://www.google.com/s2/favicons?domain=splitshire.com&sz=64', type: 'design-video' },
      { id: 'site71', name: 'Motion Elements', url: 'https://www.motionelements.com/', icon: 'https://www.google.com/s2/favicons?domain=motionelements.com&sz=64', type: 'design-video' },
      { id: 'site73', name: '制片帮素材网', url: 'https://www.zhipianbang.com/', icon: 'https://www.google.com/s2/favicons?domain=zhipianbang.com&sz=64', type: 'design-video' },
      { id: 'site75', name: '新片场', url: 'https://www.xinpianchang.com/recommend/editor', icon: 'https://www.google.com/s2/favicons?domain=xinpianchang.com&sz=64', type: 'design-video' },
      { id: 'site76', name: 'Envato Elements', url: 'https://elements.envato.com/', icon: 'https://www.google.com/s2/favicons?domain=elements.envato.com&sz=64', type: 'design-video' },
      { id: 'site77', name: 'Artgrid', url: 'https://artgrid.io/', icon: 'https://www.google.com/s2/favicons?domain=artgrid.io&sz=64', type: 'design-video' },
      { id: 'site78', name: 'Storyblocks', url: 'https://www.storyblocks.com/', icon: 'https://www.google.com/s2/favicons?domain=storyblocks.com&sz=64', type: 'design-video' },
      { id: 'site79', name: 'Motion Array', url: 'https://motionarray.com/', icon: 'https://www.google.com/s2/favicons?domain=motionarray.com&sz=64', type: 'design-video' },
      { id: 'site80', name: 'Shutterstock', url: 'https://www.shutterstock.com/', icon: 'https://www.google.com/s2/favicons?domain=shutterstock.com&sz=64', type: 'design-video' },
      { id: 'site81', name: 'Filmpac', url: 'https://filmpac.com/', icon: 'https://www.google.com/s2/favicons?domain=filmpac.com&sz=64', type: 'design-video' },
      { id: 'site92', name: 'Facebook', url: 'https://www.facebook.com/', icon: 'https://www.google.com/s2/favicons?domain=facebook.com&sz=64', type: 'social' },
      { id: 'site93', name: 'YouTube', url: 'https://www.youtube.com/', icon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64', type: 'social' },
      { id: 'site94', name: 'X(Twitter)', url: 'https://x.com/', icon: 'https://www.google.com/s2/favicons?domain=x.com&sz=64', type: 'social' },
      { id: 'site95', name: 'Instagram', url: 'https://www.instagram.com/', icon: 'https://www.google.com/s2/favicons?domain=instagram.com&sz=64', type: 'social' },
      { id: 'site96', name: 'Pinterest', url: 'https://www.pinterest.com/', icon: 'https://www.google.com/s2/favicons?domain=pinterest.com&sz=64', type: 'social' },
      { id: 'site97', name: 'Reddit', url: 'https://www.reddit.com/', icon: 'https://www.google.com/s2/favicons?domain=reddit.com&sz=64', type: 'social' },
      { id: 'site98', name: 'Quora', url: 'https://www.quora.com/', icon: 'https://www.google.com/s2/favicons?domain=quora.com&sz=64', type: 'social' },
      { id: 'site99', name: 'TikTok', url: 'https://www.tiktok.com/', icon: 'https://www.google.com/s2/favicons?domain=tiktok.com&sz=64', type: 'social' },
      { id: 'site100', name: 'WhatsApp', url: 'https://web.whatsapp.com/', icon: 'https://www.google.com/s2/favicons?domain=whatsapp.com&sz=64', type: 'social' },
      { id: 'site101', name: 'LinkedIn', url: 'https://www.linkedin.com/', icon: 'https://www.google.com/s2/favicons?domain=linkedin.com&sz=64', type: 'social' },
      { id: 'site102', name: 'Telegram', url: 'https://telegram.org/', icon: 'https://telegram.org/favicon.ico', type: 'social' },
      { id: 'site103', name: 'Snapchat', url: 'https://www.snapchat.com/', icon: 'https://www.google.com/s2/favicons?domain=snapchat.com&sz=64', type: 'social' },
      { id: 'site104', name: 'Discord', url: 'https://discord.com/', icon: 'https://www.google.com/s2/favicons?domain=discord.com&sz=64', type: 'social' },
      { id: 'site105', name: 'Tumblr', url: 'https://www.tumblr.com/', icon: 'https://www.google.com/s2/favicons?domain=tumblr.com&sz=64', type: 'social' },
    ],
  },
];

export function normalizeWebsiteGroups(groups: WebsiteGroup[]): WebsiteGroup[] {
  return groups.map((group) => ({
    ...group,
    websites: group.websites.map((site, index) => ({
      ...site,
      position: index,
    })),
  }));
}

export function loadStoredWebsiteGroups(): WebsiteGroup[] {
  const savedGroups = localStorage.getItem(STORAGE_KEYS.websiteGroups);
  if (!savedGroups) {
    return normalizeWebsiteGroups(DEFAULT_WEBSITE_GROUPS);
  }

  try {
    const parsedGroups = JSON.parse(savedGroups) as WebsiteGroup[];
    return normalizeWebsiteGroups(parsedGroups);
  } catch (error) {
    logger.error('Failed to parse saved websites:', error);
    return normalizeWebsiteGroups(DEFAULT_WEBSITE_GROUPS);
  }
}

export function getSectionDisplayName(sectionId: string, websiteGroups: WebsiteGroup[]): string {
  const section = GROUP_SECTIONS.find((s) => s.id === sectionId);
  if (!section) return sectionId;
  
  const group = websiteGroups[0];
  if (!group) return section.name;
  
  const siteInSection = group.websites.find((site) => site.type === sectionId);
  return siteInSection?.sectionName || section.name;
}