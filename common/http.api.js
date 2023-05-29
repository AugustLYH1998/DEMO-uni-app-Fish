// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
let hotSearchUrl = '/ebapi/store_api/hot_search';
let indexUrl = '/ebapi/public_api/index';

let bannerUrl = `/web/index.php?_mall_id=1&r=api/index/tpl-index`;
let noticeUrl = `/web/index.php?_mall_id=1&r=api/setting/notice`;
let topUrl = `/web/index.php?_mall_id=1&r=api/fish-pond/get-ranking-list`;
let pondUrl = `/web/index.php?_mall_id=1&r=api/fish-pond/fish-list`;
let matchUrl = `/web/index.php?_mall_id=1&r=api/match/match-list`;
let goodsCateUrl = `/web/index.php?_mall_id=1&r=api/cat/list`;
let goodsListByCateIdUrl = `/web/index.php?_mall_id=1&r=api/default/goods-list`;

let goodsDetailUrl = `/web/index.php?_mall_id=1&r=api/goods/detail`;


let seatListByPondIdUrl = `/web/index.php?_mall_id=1&r=api/fish-pond/fish-pond-seat`;

/* 支付 4*/
let step1Url = '/web/index.php?_mall_id=1&r=api/order/goods-order-submit';
let step2Url =`/web/index.php?_mall_id=1&r=api/order/pay-data`;
let step3Url = `/web/index.php?_mall_id=1&r=api/payment/get-payments`;
let step4Url = `/web/index.php?_mall_id=1&r=api/payment/pay-data`;

let loginUrl = `/web/index.php?_mall_id=1&r=api/passport/autologin`;
let userInfoUrl = `/web/index.php?_mall_id=1&r=api/user/user-info`;
let shopOrderUrl = `/web/index.php?_mall_id=1&r=api/order/list`;




const install = (Vue, vm) => {
	// 此处没有使用传入的params参数
	let getSearch = (params = {}) => vm.$u.get(hotSearchUrl, {
		id: 2
	});

	// 此处使用了传入的params参数，一切自定义即可
	let getInfo = (params = {}) => vm.$u.post(indexUrl, params);

	let getBanners = (params = {}) => vm.$u.get(bannerUrl, params);

	let getNotices = (params = {}) => vm.$u.get(noticeUrl, params);




	let getTopList = (params = {}) => vm.$u.post(topUrl, params);

	let getPondList = (params = {
		page: 1,
		limit: 2
	}) => vm.$u.get(pondUrl, params);

	let getMatchList = (params = {
		page: 1,
		limit: 2
	}) => vm.$u.get(matchUrl, params);
	let getGoodsCate = (params = {
		page: 1,
		limit: 2
	}) => vm.$u.get(goodsCateUrl, params);

	let getGoodsListByCateId = (params = {
		page: 1,
		limit: 10,
		cat_id
	}) => vm.$u.get(goodsListByCateIdUrl, params);

	let getGoodsDetail = (id) => vm.$u.get(goodsDetailUrl, {
		id
	});
	let getSeatByPondId = (id) => vm.$u.get(seatListByPondIdUrl, {
		id
	});



	let payStep1 = (params = {}) => vm.$u.post(step1Url, params);
	let payStep2 = (params = {}) => vm.$u.post(step2Url, params);
	let payStep3 = (id) => vm.$u.get(step3Url, {id});
	
	let payStep4 = (params) => vm.$u.get(step4Url, params);
	
	let login = (params = {}) => vm.$u.post(loginUrl, params);
	

	let getUserInfo = (params) => vm.$u.get(userInfoUrl, params);
	let getShopOrder = (params) => vm.$u.get(shopOrderUrl, params);
	
	
	

	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		getSearch,
		getInfo,
		getBanners,
		getNotices,
		getTopList,
		getPondList,
		getMatchList,
		getGoodsCate,
		getGoodsListByCateId,
		getGoodsDetail,
		getSeatByPondId,
		payStep1,
		payStep2,
		payStep3,
		payStep4,
		login,
		getUserInfo,
		getShopOrder,



	};
}

export default {
	install
}
