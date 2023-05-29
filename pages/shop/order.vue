<template>
	<view class="wrap">
		<u-card :show-head="false">
			<view slot="body" class="header">
				<u-image width="232" height="232" border-radius="8" :src="cover_pic">
				</u-image>
				<view class="info">
					<view class="title">
						{{ goods_name }}
					</view>
					<view class="price"><text class="bt">¥</text><text class="number">{{ price }}元</text></view>
				</view>

			</view>
		</u-card>

		<view class="card">
			<u-cell-group>
				<u-cell-item title="数量" :arrow="false">
					<u-number-box slot="right-icon" v-model="goods_number" @change="valChange"></u-number-box>
				</u-cell-item>

			</u-cell-group>

			<u-cell-group>
				<!-- 点击鱼塘位置的时候，上拉一个 popup 可以供用户选择鱼塘 -->
				<u-cell-item :title="pondTitle" @click='pondHandler'></u-cell-item>
			</u-cell-group>

			<u-cell-group>
				<u-cell-item :title="seatTitle" @click='seatHandler'></u-cell-item>
			</u-cell-group>

			<u-cell-group>
				<u-cell-item title="微信支付" @click="payHandler" index="1" :arrow="false">
					<u-image width="28" height="28"
						:src="`/static/images/${selectedPay == '1' ? '' : 'no-'}pay-icon.png`" slot="right-icon">
					</u-image>
				</u-cell-item>
				<u-cell-item title="现金支付" @click="payHandler" index="4" :arrow="false">
					<u-image width="28" height="28"
						:src="`/static/images/${selectedPay == '4' ? '' : 'no-'}pay-icon.png`" slot="right-icon">
					</u-image>
				</u-cell-item>
				<u-cell-item title="余额支付" @click="payHandler" index="3" :arrow="false">
					<u-image width="28" height="28"
						:src="`/static/images/${selectedPay == '3' ? '' : 'no-'}pay-icon.png`" slot="right-icon">
					</u-image>
				</u-cell-item>
			</u-cell-group>

			<u-cell-group style='margin-top: 10rpx;'>
				<u-input type='textarea' v-model="remark" height='50' :border="true" :auto-height="true"
					placeholder='请输入备注内容'></u-input>
			</u-cell-group>



			<view class="markup">
				备注：现金支付或其他支付由现场工作人员操作
			</view>

			<button class="sub footer" @click="payNow">立即支付</button>


		</view>

		<u-picker mode="selector" @confirm='pondConfirm' v-model="pondStatus" :default-selector="[0]" :range="pondList"
			range-key="name">

		</u-picker>

		<u-picker mode="selector" @confirm='seatConfirm' v-model="seatStatus" :default-selector="[0]" :range="seatList"
			range-key="seat_id">

		</u-picker>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				checked: false,
				// goodsNumber: 1,
				selectedPay: '1',
				goods_id: -1,
				goods_number: -1,
				goods_name: '',
				goods_attr_id: -1,
				price: -1,
				cover_pic: '',
				pondStatus: false, // 控制鱼塘的 picker 是否显示
				pondList: [], // 鱼塘列表
				seatList: [], // 钓位列表
				selectedPond: null,
				pondTitle: '选择鱼塘位置',

				seatStatus: false,
				seatTitle: '选择钓位几号',
				selectedSeat: null,
				remark: '',
				wxPayment: {},


			};
		},
		onLoad(options) {
			console.log('op', options);
			this.goods_id = options.id;
			this.goods_number = options.num;
			this.goods_name = options.goods_name;
			this.goods_attr_id = options.goods_attr_id;
			this.price = options.price;
			this.cover_pic = options.cover_pic;
			this.getPondList();


		},
		methods: {

			async payNow() {

				if (!this.selectedPond) {
					uni.showToast({
						icon: 'error',
						title: '请选择鱼塘'
					});
					return;
				}

				if (!this.selectedSeat) {
					uni.showToast({
						icon: 'error',
						title: '请选择钓位'
					});
					return;
				}

				console.log('payNow 支付 1. 支付的数据处理好，数据要看接口');
				let payData = {
					"fish_pond_id": this.selectedPond.id,
					"fish_pond_seat_id": this.selectedSeat.seat_id + '',
					"goods_id": this.goods_id,
					"goods_attr_id": this.goods_attr_id,
					"num": this.goods_number,
					"pay_type": this.selectedPay,
					"remark": this.remark,
				}
				// 进行支付 支付分为四步

				try {

					let step1 = await this.$u.api.payStep1({
						form_data: JSON.stringify(payData)
					});

					console.log('step1', step1);

					let {
						list: {
							token,
							queue_id
						}
					} = step1.data;

					let step2 = await this.$u.api.payStep2({
						token,
						queue_id
					});

					console.log('step2', step2);
					
					let {id} = step2.data;
					
					let step3 = await this.$u.api.payStep3(id);
					
					console.log('step3', step3);
					
					let {
						list: [
							{
								key: pay_type
							}
						]
					} = step3.data;
					
					let step4 = await this.$u.api.payStep4({
						id,
						pay_type,
					});

					console.log('step4', step4); // 生成了小程序唤起支付的参数
					
					this.wxPayment = step4.data;
					
					// 根据服务器返回的参数就可以唤起微信支付
					uni.requestPayment({
					    appid: this.wxPayment.appId,
					    id: this.wxPayment.id,
					    provider: 'wxpay',
					    timeStamp: this.wxPayment.timeStamp,
					    nonceStr: this.wxPayment.nonceStr,
					    package: this.wxPayment.package,
					    signType: this.wxPayment.signType,
					    paySign: this.wxPayment.paySign,
					
					    success: function(res) {
					        uni.showModal({
					            title: '支付成功',
					            showCancel: false,
					            success: function(res) {
					                console.log('用户点击确定');
									uni.navigateTo({
										url: '/pages/mine/shopOrder'
									})
									// 前往订单页，展示用户的订单的信息
									// 原理性的东西 step4 第四步的参数是如何生成的，我们前端只能通过调用后端接口获取
									// 如果自己会后端，我们可以自己去构造数据。
									// nodejs 支付的参数是如何生成的？ // 大家无法在自己的微信小程序 appid ，微信的支付的敏感性，需要商户的信息
									// 营业执照，银行卡 // 真实的支付 // 明天怎么申请，如何做后端的支付参数
					            }
					        });
					    },
					    fail: function(err) {
					        uni.showModal({
					            title: '支付取消',
					            showCancel: false,
					            complete: function(res) {
					
					                console.log('用户点击确定');
					            }
					        });
					    }
					});



				} catch (e) {
					
					
					console.log('e', e);
					
					

				}



			},

			seatHandler() {
				// 用户必须先选择鱼塘，才可以选择钓位
				if (!this.selectedPond) {
					uni.showToast({
						icon: 'error',
						title: '请选择鱼塘'
					});
					return;
				}

				this.seatStatus = true;

			},

			seatConfirm([index]) {


				console.log('index', index);
				this.selectedSeat = this.seatList[index];
				this.seatTitle = this.selectedSeat.seat_id + '号钓位';

			},

			async pondConfirm([index]) {
				console.log(index);
				// 得知用户选择了那个鱼塘
				this.selectedPond = this.pondList[index];
				this.pondTitle = this.selectedPond.name;

				// 获取当前鱼塘下的钓位列表
				const res = await this.$u.api.getSeatByPondId(this.selectedPond.id);
				this.seatList = res.data;

			},

			pondHandler() {
				this.pondStatus = true;
			},
			async getPondList() {
				const res = await this.$u.api.getPondList();
				console.log("res: ", res);
				this.pondList = res.data.list;

			},
			valChange(e) {
				console.log('当前值为: ' + e.value)
			},
			payHandler(index) {
				console.log('payHandler', index, arguments);
				this.selectedPay = index;
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f8;
	}

	.footer {
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 0rpx;
		width: 100%;
		padding: 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
	}

	.wrap {
		padding-bottom: 20rpx;

		.header {
			display: flex;

			.info {
				margin-left: 54rpx;
				color: #1A1B1D;
				font-size: 32rpx;
				line-height: 44rpx;

			}

			.price {
				color: #F38B10;
				margin-top: 40rpx;

				.bt {
					font-size: 24rpx;

				}

				.number {
					font-size: 32rpx;
				}
			}

		}

		.card {
			padding: 0 24rpx;
		}

		.markup {
			font-size: 24rpx;
			color: #1A1B1D;
			margin-top: 30rpx;
			margin-bottom: 112rpx;

		}

		.sub {
			width: 632rpx;
			height: 72rpx;
			line-height: 72rpx;
			border-radius: 36rpx;
			background-color: #282828;
			color: #fff;
			font-size: 32rpx;
			margin-bottom: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;

		}


	}
</style>
