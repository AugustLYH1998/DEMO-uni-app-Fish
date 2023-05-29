<template>
	<view class="wrap">
		<view class="goods-info">
			<u-image width="100%" height="508" :src="info.cover_pic"></u-image>
			<view class="info">
				<view class="title">{{ info.name }}</view>
				<view class="short-title">{{ info.subtitle }}</view>
				<view class="price"><text class="bt">¥</text><text class="number">{{ info.price }}元</text></view>
			</view>
		</view>
		<view class="sku goods-info">
			<u-cell-group>
				<u-cell-item title="选择规格"></u-cell-item>
			</u-cell-group>
		</view>
		<view class="descp">
			<u-cell-group :border="false">
				<u-cell-item :border-bottom="false" :arrow="false" title="商品详情"></u-cell-item>
			</u-cell-group>
			<view class="deails">
				<u-parse :html="info.detail"></u-parse>
			</view>
		</view>

		<view class="footer">
			<view class="fav-icon selected"></view>
			<button class="sub" @click="skuHandler">立即购买</button>
		</view>


		<u-popup v-model="showPopup" mode="bottom" border-radius="20" height="980rpx" :closeable="true">
			<view class="sku-select">
				<!-- 1. 商品简介 -->
				<view class="short-cut">
					<view class="cover">
						<u-image width="232" height="232" border-radius="8" :src="info.cover_pic"></u-image>
					</view>

					<view class="info">
						<view class="title">{{ info.name }}</view>
						<view class="price"><text class="bt">¥</text><text
								class="number">{{ currentGoods.price }}元</text>
						</view>
					</view>

				</view>

				<!-- 2. sku 列表 -->
				<view class="list">
					<!-- 每一个 item 就是一个商品的 sku 属性 详情接口里面查看当前商品的 sku 信息 -->
					<view class="item" v-for="(item, index) in info.attr_groups" :key='item.attr_group_id'>
						<view class="title">{{ item.attr_group_name }}</view>
						<view class="tags">
							<view class="tag" :class="{active: val.attr_id == currentIds[index]}"
								v-for="val in item.attr_list" :key='val.attr_id' @click="selectedHandler(val, index)">
								{{ val.attr_name }}
							</view>
						</view>
					</view>


				</view>

				<!-- 3. 购买数量 -->
				<view class="buy-counter">
					<text>数量</text>
					<u-number-box v-model="goodsNumber" @change="goodsNumberChangeHandler"></u-number-box>
				</view>

				<!-- 4. 立即购买 -->
				<button class="sub" @click="orderHandler">立即购买</button>
			</view>

		</u-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPopup: false,
				goodsNumber: 1,
				id: -1, // 初始化代表不存在的数据，实际的数是列表页面点击后传递过来的。
				info: {},
				// 由于sku的第一个属性默认都是选中的，那么我们在页面详情数据加载后，默认把第一个进行选中
				currentIds: [], // 存放 sku 属性 id
				currentNames: [], // 存放 sku 属性的名称
				currentGoods: {}, // 存放用户通过 sku 选择的商品


			}
		},
		onLoad(options) {
			console.log('options', options);
			this.id = options.id;

			this.getGoodsDetail(this.id);

		},
		methods: {
			computedSkuInfo() {
				let sign_id = this.currentIds.join(':');
				this.currentGoods = this.info.attr.find(item => item.sign_id === sign_id);

			},

			selectedHandler(val, index) {

				// 1. 知道用户点了哪个 sku 属性
				// 2. 把对应的 sku 的属性里面的 某个 attr_id 和 attr_name 存起来
				this.currentIds[index] = val.attr_id;
				this.currentNames[index] = val.attr_name;

				console.log(this.currentIds, this.currentNames);

				// 3. 根据用户选择的 sku 的属性然后动态的获取价格 每个 sku 的信息是通过 : 进行链接
				this.computedSkuInfo();
				// 注意事项：在 vuejs2 里面，我们如果是通过下标操作数据，数据不会响应式 vuejs 底层 使用 Object.defineProperty
				this.$forceUpdate();

			},
			async getGoodsDetail(id) {
				const res = await this.$u.api.getGoodsDetail(id);
				console.log("res: ", res);
				this.info = res.data.goods;
				// 把每个sku的第一个都取出来
				this.currentIds = this.info.attr_groups.map(item => item.attr_list[0].attr_id);
				this.currentNames = this.info.attr_groups.map(item => item.attr_list[0].attr_name);

				// 然后把第一个sku属性的商品的价格取出来 默认选择每个 sku 的第一个商品的信息
				// let sign_id = this.currentIds.join(':');
				// this.currentGoods =  this.info.attr.find( item => item.sign_id === sign_id );
				this.computedSkuInfo();


			},
			skuHandler() {
				this.showPopup = true;
			},
			goodsNumberChangeHandler(e) {
				console.log('当前值为: ' + e.value)

			},
			orderHandler() {
				// 当用户选择好sku商品后，则需要进行下单支付
				// 支付前需要判定用户是否登录，只有登录之后才有权限去做下单的操作
				// TODO：
				let paras = {};
				// JSON.stringify(paras);
				
				uni.navigateTo({
					url: `./order?id=${this.currentGoods.goods_id}&goods_attr_id=${this.currentGoods.id}&num=${this.goodsNumber}&goods_name=${this.info.name}&price=${this.currentGoods.price}&cover_pic=${this.info.cover_pic}`,
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f8;
	}

	.wrap {

		padding-bottom: 120rpx;

	}

	.goods-info {
		background-color: #fff;
		margin-bottom: 20rpx;

		.info {
			padding: 10rpx;

			.title {
				line-height: 1.8;
				color: #1a1b1d;
			}

			.short-title {
				line-height: 1.6;
				color: #7b7b7b;

			}

			.price {
				color: #f38b11;

				.bt {
					font-size: 24rpx;

				}

				.number {
					font-size: 30rpx;

				}
			}
		}

	}

	.descp {
		background-color: #fff;

		.deails {
			padding: 20rpx;

		}
	}


	.footer {
		position: fixed;
		left: 0;
		bottom: 0rpx;
		width: 100%;
		padding: 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;

		.fav-icon {
			width: 48rpx;
			height: 48rpx;
			margin-right: 30rpx;
			background: url(../../static/images/no-fav-icon.png) no-repeat center #fff;
			background-size: 48rpx 48rpx;

			&.selected {
				background: url(../../static/images/fav-icon.png) no-repeat center #fff;
				background-size: 48rpx 48rpx;
			}
		}

		.sub {
			width: 580rpx;
			height: 72rpx;
			line-height: 72rpx;
			border-radius: 36rpx;
			background-color: #282828;
			color: #fff;
			font-size: 32rpx;
		}
	}


	.sku-select {
		padding: 20rpx 60rpx 20rpx 20rpx;

		.short-cut {
			display: flex;

			.cover {
				margin-right: 38rpx;
			}

			.info {
				.title {
					color: #1A1B1D;
					font-size: 28rpx;
					line-height: 44rpx;
				}

				.price {
					color: #F38B10;

					.bt {
						font-size: 24rpx;
					}

					.number {}
				}
			}

		}

		.list {
			.item {
				font-size: 32rpx;
				color: #1A1B1D;

				.title {
					margin-top: 78rpx;
					margin-bottom: 16rpx;

				}

				.tags {
					display: flex;

					.tag {
						height: 68rpx;
						line-height: 68rpx;
						border-radius: 8rpx;
						padding: 0 40rpx;
						background-color: #F1F1F1;
						color: #1A1B1D;
						font-size: 28rpx;
						margin-right: 16rpx;
						margin-bottom: 16rpx;

						&.active {
							background-color: #5D7291;
							color: #fff;
						}

					}
				}


			}
		}

		.buy-counter {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 32rpx;
			color: #1A1B1D;
			margin-top: 60rpx;
			margin-bottom: 104rpx;

		}

		.sub {
			width: 632rpx;
			height: 72rpx;
			line-height: 72rpx;
			border-radius: 36rpx;

			background-color: #282828;
			color: #fff;

		}


	}
</style>
