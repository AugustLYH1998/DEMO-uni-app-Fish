<template>
	<view class="wrap">
		<view class="user-cover">
			<!-- 1. 头部用户信息 用户已经登录-->
			<view class="user-login" v-if="isLoginStatus">
				<view class="user-info">
					<view class="avatar">
						<u-image width="100" height="100" shape="circle" :src="vuex_user_info.avatar"></u-image>
					</view>
					<view class="info">
						<view class="nickname">{{ vuex_user_info.nickname }}</view>
						<view class="tel">{{ vuex_user_info.mobile }}</view>
					</view>
				</view>


				<view class="balance">
					<view class="left-money money">
						<text>我的余额</text>
						<text>0.00</text>
					</view>

					<navigator url="/pages/mine/huiYuBalance" class="money">
						<view class="hy-money money">
							<text>回鱼收入</text>
							<text>0</text>
						</view>
					</navigator>

					<navigator url="/pages/mine/coupon" class="money">
						<view class="coupon money">
							<text>优惠券</text>
							<text>0</text>
						</view>
					</navigator>
				</view>
			</view>
			<!-- 1. 头部用户信息 用户未登录-->
			<view class="user-no-login" @click="authLogin" v-else>
				登录 / 注册 - {{ vuex_version }}
			</view>

			<!-- 2. 优惠券购买 -->
			<view class="wrap-bg">
				<view class="coupon-container">
					<view class="title">十鲤钓场*大优惠</view>
					<view class="descp">一次购买10场，即可享受免费赠送一场</view>
					<view class="coupon-list">
						<view class="item" v-for=" n in 3" :key="n">
							<text>买10场赠送一场</text>
							<text>鲤鱼塘</text>
							<view class="price">¥ 1100</view>
						</view>
					</view>
				</view>
			</view>

		</view>






		<!-- 3. 我的成绩 -->
		<view class="score wrap-in">
			<view class="title">我的成绩</view>
			<view class="list">
				<view class="item">
					<text>鱼获</text>
					<text>0</text>
				</view>
				<view class="item">
					<text>次数</text>
					<text>0</text>
				</view>
				<view class="item">
					<text>过百</text>
					<text>0</text>
				</view>
				<view class="item">
					<text>坑冠</text>
					<text>0</text>
				</view>
			</view>
		</view>

		<!-- 4. 订单信息 -->
		<view class="score wrap-in">
			<view class="list">
				<view url="/pages/mine/myOrder" @click="goShopOrderHandler">
					<view class="item">
						<u-image width="76" height="76" src="/static/images/myorder.png"></u-image>
						<text class="icon-title">我的订单</text>
					</view>

				</view>

				<navigator url="/pages/mine/subOrder">
					<view class="item">
						<u-image width="76" height="76" src="/static/images/suborder.png"></u-image>
						<text class="icon-title">预约订单</text>
					</view>

				</navigator>
				<navigator url="/pages/mine/collect">
					<view class="item">
						<u-image width="80" height="80" src="/static/images/myfav.png"></u-image>
						<text class="icon-title">我的收藏</text>
					</view>
				</navigator>

				<view class="item" @click="shareHandler">
					<u-image width="78" height="78" src="/static/images/myshare.png"></u-image>
					<text class="icon-title">推广分享</text>
				</view>
			</view>
		</view>

		<!-- 5. 隐私政策 和 员工端管理 -->

		<view class="score wrap-in">
			<u-cell-group>

				<u-cell-item :title-style="{'font-size': '32rpx', 'color': '#1A1B1D'}" title="隐私政策"
					@click="privateHandler">
					<u-image class="private-icon" slot="icon" width="48" height="48"
						src="/static/images/privateicon.png"></u-image>
				</u-cell-item>

				<u-cell-item :title-style="{'font-size': '32rpx', 'color': '#1A1B1D'}" title="员工端管理"
					@click="staffHandler">
					<u-image class="user-icon" slot="icon" width="48" height="48" src="/static/images/usericon.png">
					</u-image>
				</u-cell-item>
			</u-cell-group>
		</view>

		<!-- 6. 退出登录 -->
		<button class="login-out">退出登录</button>

		<!-- 推广和分享 -->
		<u-popup v-model="showPopup" mode="bottom" border-radius="20" height="1058rpx" :closeable="false">

			<view class="share-cover">
				<u-image src="/static/images/share_default.png" width="702rpx" height="1058rpx"></u-image>
			</view>
		</u-popup>


	</view>
</template>

<script>
	export default {

		methods: {
			goShopOrderHandler() {
				if (!this.isLoginStatus) {
					uni.showToast({
						title: '请登录后操作',
					});
					return;
				}
				uni.navigateTo({
					url: './shopOrder',
				})
			},
			async authLogin() {
				// this.isLoginStatus = true;
				// wx.login(); // code

				let info = await wx.getUserProfile({
					desc: '完善用户信息'
				}); // 可以弹出授权页面，获取用户的基本信息，例如 昵称，头像 // 微信的版本 2.20 以下
				let {
					code
				} = await wx.login();

				console.log("info: ", info, code);

				let {
					encryptedData,
					iv,
					rawData,
					signature
				} = info;






				let postData = {
					encryptedData,
					iv,
					rawData,
					signature,
					code,
				};


				const res = await this.$u.api.login(postData)

				console.log("res: ", res);

				// 获取到token 然后在调用  getUserInfo 获取用户的信息，然后在页面显示
				// 由于用户的信息要在很多页面组件使用，为了方便组件间通信，则我们可以考虑使用 vuex 状态机保存用户的信息
				// https://v1.uviewui.com/guide/globalVariable.html

				this.$u.vuex('vuex_user_token', res.data.access_token);
				this.$u.vuex('isLoginStatus', true);


				// 获取用户的基本信息
				const userInfo = await this.$u.api.getUserInfo();

				console.log("userInfo: ", userInfo);

				this.$u.vuex('vuex_user_info', userInfo.data);




			},
			privateHandler() {
				uni.navigateTo({
					url: '/pages/mine/privateRule'
				})
			},
			staffHandler() {
				uni.navigateTo({
					url: '/pages/staff/staff'
				})
			},
			shareHandler() {
				this.showPopup = true;
			}


		},

		data() {
			return {
				showPopup: false,
				// isLoginStatus: false,
			};
		}
	}
</script>

<style lang="scss">
	.wrap {
		width: 100%;
		background-color: #f7f7f8;

		.wrap-in {
			width: 750rpx - 24*2;
			margin: 0 auto;

		}

	}

	.user-cover {
		width: 750rpx;
		height: 634rpx;
		background: url(../../static/images/user_bg.png) no-repeat;
		background-size: 750rpx 564rpx;
		padding-top: 24rpx;

		.user-login {
			// display: none;
		}

		.user-no-login {
			color: #fff;
			padding-left: 50rpx;
			font-weight: bold;
			line-height: 100rpx;
			// margin-bottom: 60rpx;
			margin-bottom: 120rpx;
		}

		.user-info {
			display: flex;
			align-items: center;
			color: #fff;
			padding-left: 40rpx;

			.avatar {
				margin-right: 20rpx;
			}

			.info {

				.nickname {
					font-size: 30rpx;
					line-height: 1.4;
				}

				.tel {
					font-size: 24rpx;
				}

			}
		}


		.balance {
			padding-top: 20rpx;
			display: flex;
			width: 100%;

			.money {
				height: 100rpx;
				color: #fff;

				display: flex;
				flex: 1;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
			}
		}



	}

	.share-cover {
		display: flex;
		justify-content: center;
		background: transparent;
	}

	.header-info {
		padding-top: 100rpx;
		width: 750rpx;
		height: 564rpx;

		background: url(../../static/images/user_bg.png) no-repeat;
		background-size: 750rpx 564rpx;

		.user-info {
			display: flex;
			align-items: center;
			color: #fff;
			padding-left: 40rpx;

			.avatar {
				margin-right: 20rpx;
			}

			.info {

				.nickname {
					font-size: 30rpx;
					line-height: 1.4;
				}

				.tel {
					font-size: 24rpx;
				}

			}


		}

		.balance {
			padding-top: 20rpx;
			display: flex;
			width: 100%;

			.money {
				height: 100rpx;
				color: #fff;

				display: flex;
				flex: 1;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
			}
		}
	}

	.wrap-bg {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}

	.coupon-container {
		background-color: #3b3f54;
		width: 90%;
		padding: 20rpx;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.title {
			font-size: 40rpx;
			color: #ffdfba;

		}

		.descp {
			font-size: 24rpx;
			color: #ffdfba;
		}

		.coupon-list {
			width: 100%;
			margin-top: 20rpx;
			display: flex;
			justify-content: space-around;

			.item {
				padding: 10rpx;
				font-size: 24rpx;
				color: #382c1e;
				width: 200rpx;
				height: 200rpx;
				background-color: #fff5e5;
				border: 2rpx solid #d4a673;
				border-radius: 6rpx;

				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;

				.price {
					width: 100rpx;
					height: 50rpx;
					line-height: 50rpx;
					text-align: center;
					border-radius: 25rpx;
					background-color: #636073;
					color: #fde6a4;
				}
			}

		}
	}

	.score {
		background-color: #fff;
		padding: 10rpx;
		border-radius: 10rpx;
		margin-bottom: 20rpx !important;

		.title {
			line-height: 3;
		}

		.private-icon,
		.user-icon {
			margin-right: 16rpx;
		}

		.list {
			display: flex;
			justify-content: space-between;

			.item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				text:first-child {
					line-height: 2;

				}

				.icon-title {
					margin-top: 32rpx;
				}
			}
		}


	}

	.login-out {
		width: 632rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		border-radius: 44rpx;
		background-color: #282828;
		color: #fff;
		margin-top: 48rpx;

	}
</style>
