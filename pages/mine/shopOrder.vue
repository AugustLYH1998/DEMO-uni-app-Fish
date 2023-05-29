<template>
	<view class="wrap">

		<!-- 1. 暂无优惠券 -->
		<view class="no_coupon" v-if="hasCoupon">
			<u-empty class="empty" icon-size="268" color="#1A1B1D" font-size="28" text="暂无优惠券可使用哦~"
				src="/static/images/no_coupon_default.png"></u-empty>
		</view>

		<!-- 2. 优惠券列表 -->
		<view class="coupon_list_container" v-else>
			<!-- 2.1 切换栏 -->
			<view class="u-tabs-box">
				<u-tabs-swiper activeColor="#5d7291" :bar-width="138" inactive-color="#1a1b1d" ref="tabs" :list="list"
					:current="current" @change="change" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
			</view>
			<!-- 2.2 优惠券内容 -->
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition"
				@animationfinish="animationfinish">

				<swiper-item class="swiper-item" v-for="e  in list" :key='e.name'>
					<scroll-view scroll-y style="height: 100%;width:100%;" @scrolltolower="reachBottom">
						<view class="page-box">
							<view class="card">
								<navigator :url="'/pages/shop/detail?id='" v-for="item in orderInfoList" :key='item.id' class="item">
									<view class="order-item">
										<view class="header">
											<view class="date">日期：{{ item.created_at }}</view>
											<view class="pay-status no-pay">{{ item.status_text }}</view>
										</view>
										<view class="body">
											<view class="left">
												<u-image width="200" height="200"
													:src="item.detail && item.detail[0].goods_info.pic_url">
												</u-image>
											</view>
											<view class="right">
												<view class="info">
													<view class="tags">{{ item.detail && item.detail[0].goods_info.name  }}</view>
													<view class="fish-info">
														<view class="location">鱼塘：{{ item.detail && item.detail[0].fish_pond_name }}  钓位：{{ item.detail && item.detail[0].fish_pond_seat_id }}号</view>
													</view>
													<view class="price">
														价格：<text class="bt">¥</text>
														<text class="number">{{ item.total_price }}</text>元
													</view>
													<view>数量：{{ item.detail && item.detail[0].goods_info.num  }}</view>

												</view>
											</view>
										</view>
										<view class="footer">
											<view class="total">
												<view class="price-title">
													<text class="hj">合计：</text>
													<text class="bt">¥</text>
													<text class="number">{{ item.total_price}}</text>元
												</view>
												<view class="pay">付款</view>
											</view>
										</view>
										<view class="markup">留言备注：{{ item.remark }}</view>
									</view>
								</navigator>

							</view>
							<u-loadmore :status="loadStatus[0]" bgColor="#f7f7f8"></u-loadmore>

						</view>
					</scroll-view>
				</swiper-item>


			</swiper>

		</view>

	</view>
</template>


<script>
	export default {
		data() {
			return {
				orderList: [
					[],
					[],
					[],
					[]
				],
				dataList: [{
						id: 3,
						store: '华为',
						deal: '交易失败',
						goodsList: [{
							goodsUrl: '//img11.360buyimg.com/n7/jfs/t1/94448/29/2734/524808/5dd4cc16E990dfb6b/59c256f85a8c3757.jpg',
							title: '三星（SAMSUNG）京品家电 UA65RUF70AJXXZ 65英寸4K超高清 HDR 京东微联 智能语音 教育资源液晶电视机',
							type: '4K，广色域',
							deliveryTime: '保质5年',
							price: '1998',
							number: 3
						}]
					},
					{
						id: 5,
						store: '三星旗舰店',
						deal: '交易成功',
						goodsList: [{
							goodsUrl: '//img12.360buyimg.com/n7/jfs/t1/52408/35/3554/78293/5d12e9cfEfd118ba1/ba5995e62cbd747f.jpg!q90.jpg',
							title: '企业微信 中控人脸指纹识别考勤机刷脸机 无线签到异地多店打卡机WX108',
							type: '识别效率高',
							deliveryTime: '使用方便',
							price: '451',
							number: 9
						}]
					}
				],
				list: [{
						name: '待付款',
						value: 1,
					},
					{
						name: '已付款',
						value: 2,
					},
					{
						name: '已完成',
						value: 3
					},
				],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
				loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore'],
				orderInfoList: [],
				
				status: 1, // 代付款 2 代表是已付款（未收货） 3 代表是已完成
			};
		},
		onLoad() {
			// this.getOrderList(0);
			// this.getOrderList(1);
			// this.getOrderList(3);
			
			this.getShopOrderList();
		},
		computed: {
			hasCoupon() {
				return false;
			},

			// 价格小数
			priceDecimal() {
				return val => {
					if (val !== parseInt(val)) return val.slice(-2);
					else return '00';
				};
			},
			// 价格整数
			priceInt() {
				return val => {
					if (val !== parseInt(val)) return val.split('.')[0];
					else return val;
				};
			}
		},
		methods: {
			async getShopOrderList() {
				const res = await this.$u.api.getShopOrder({status: this.status});
				// https://www.bejson.com/jsonviewernew/
				console.log("res: =============================",res);
				this.orderInfoList = res.data.list;
				

			},

			reachBottom() {
				// 此tab为空数据
				if (this.current != 2) {
					this.loadStatus.splice(this.current, 1, "loading")
					setTimeout(() => {
						this.getOrderList(this.current);
					}, 1200);
				}
			},
			// 页面数据
			getOrderList(idx) {
				for (let i = 0; i < 5; i++) {
					let index = this.$u.random(0, this.dataList.length - 1);
					let data = JSON.parse(JSON.stringify(this.dataList[index]));
					data.id = this.$u.guid();
					this.orderList[idx].push(data);
				}
				this.loadStatus.splice(this.current, 1, "loadmore")
			},
			// 总价
			totalPrice(item) {
				let price = 0;
				item.map(val => {
					price += parseFloat(val.price);
				});
				return price.toFixed(2);
			},
			// 总件数
			totalNum(item) {
				let num = 0;
				item.map(val => {
					num += val.number;
				});
				return num;
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
				// this.getOrderList(index);
				console.log("index: ",index); 
				this.status = this.list[index].value;
				this.getShopOrderList();
				
			},
			transition({
				detail: {
					dx
				}
			}) {
				this.$refs.tabs.setDx(dx);
			},
			animationfinish({
				detail: {
					current
				}
			}) {
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			}
		}
	};
</script>


<style lang="scss">
	page {
		background-color: #f7f7f8;
	}

	.wrap {
		width: 100%;
		background-color: #f7f7f8;


	}
</style>


<style lang="scss" scoped>
	.wrap {
		width: 100%;
		background-color: #f7f7f8;

		.no_coupon {
			.empty {
				padding-top: 56rpx;
			}
		}

		.swiper-box {
			margin-top: 26rpx;
			height: calc(100vh - var(--window-top) - 150rpx);
			padding: 0 24rpx;

			.swiper-item {
				background-color: #f7f7f8;

				.page-box {
					.card {
						.order-item {
							padding: 24rpx;
							background-color: #fff;
							margin-bottom: 16rpx;
							border-radius: 12rpx;

							.header {
								display: flex;
								justify-content: space-between;
								color: #1A1B1D;
								font-size: 24rpx;
								margin-bottom: 34rpx;

								.date {}

								.pay-status {
									color: #F38B10;
								}
							}

							.body {
								display: flex;

								.left {
									margin-right: 50rpx;
								}

								.right {
									color: #1A1B1D;
									line-height: 44rpx;
									font-size: 24rpx;

									.info {
										.title {
											font-size: 32rpx;
										}

										.tags {
											font-size: 24rpx;

										}

									}

									.fish-info {
										display: flex;
										align-items: center;

										.time {
											height: 48rpx;
											line-height: 48rpx;
											background-color: #5D7291;
											padding: 0 8rpx;
											color: #fff;
											border-radius: 4rpx;
											margin-right: 16rpx;

										}

										.location {
											font-size: 24rpx;
										}
									}

									.price {
										font-size: 28rpx;

										.bt {
											color: #F38B10;
											font-size: 24rpx;
										}

										.number {
											font-size: 32rpx;
											color: #F38B10;
										}
									}

								}
							}

							.footer {
								display: flex;
								justify-content: flex-end;
								margin-top: 22rpx;

								.total {
									display: flex;
									align-items: center;

									.price-title {
										.hj {
											color: #1A1B1D;
											font-size: 28rpx;

										}

										.bt {
											font-size: 24rpx;
											color: #F38B10;
										}

										.number {
											font-size: 32rpx;
											color: #F38B10;

										}
									}

									.pay {
										margin-left: 26rpx;
										height: 48rpx;
										line-height: 48rpx;
										border-radius: 24rpx;
										border: 1px solid #5D7291;
										color: #5D7291;
										padding: 0 32rpx;
									}

								}

							}

							.markup {
								margin-top: 18rpx;
								font-size: 24rpx;
								color: #1A1B1D;

							}
						}

					}
				}
			}

		}
	}

	.swiper-item {
		height: 100%;
	}
</style>
