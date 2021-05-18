export default {
	editOrder(state,order){
		state.editOrder=JSON.parse(JSON.stringify(order))
	},
	resetOrder(state,order){
		state.editOrder={addtime:'',ordertime:'',id:'',total:0,data:[]}
	},
	saveOrder(state,orderMsg){
		let orders=uni.getStorageSync('orderList_'+orderMsg.date)
		orders.unshift(orderMsg.data)
		uni.setStorage({
			key:'orderList_'+orderMsg.date,
			data:orders,
			success(res) {
				uni.showToast({title:'订单已保存'})
			},
			fail(res) {
				uni.showToast({title:'保存失败！',icon:'none'})
				console.log(res)
			}
		})
	},
	delOrder(state,orderMsg){
		console.log('提交删除')
		uni.getStorage({
			key:'orderList_'+orderMsg.date,
			success(res){
				let orders=res.data
				for(let i in orders){
					if(orders[i].id===orderMsg.data.id){
						orders.splice(i,1)
						uni.setStorage({
							key:'orderList_'+orderMsg.date,
							data:orders,
							success(res) {
								uni.showToast({title:'订单已删除'})
							},
							fail(res) {
								uni.showToast({title:'保存失败！',icon:'none'})
								console.log(res)
							}
						})
					}
				}
			}
		})
	},
	updateOrder(state,orderMsg){
		uni.getStorage({
			key:'orderList_'+orderMsg.date,
			success(res){
				let orders=res.data
				for(let i in orders){
					if(orders[i].id==orderMsg.data.id){
						orders.splice(i,1,orderMsg.data)
						uni.setStorage({
							key:'orderList_'+orderMsg.date,
							data:orders,
							success() {
								console.log('已更新order到',orderMsg.date,'订单',orders[i].data)
								uni.showToast({title:'订单已更新'})
								return ;
							},
							fail() {
								uni.showToast({title:'编辑保存错误！',icon:'none'})
								return ;
							}
						})
					}
				}
			},
			fail(res) {
				console.log(res)
			}
		})
	},
	updateFood(state,orderMsg){
		uni.getStorage({
			key:'orderList_'+orderMsg.date,
			success(res){
				let orders=res.data
				for(let order of orders){//order级
					for(let i in order.data){//order.data级
						if(order.data[i].id===orderMsg.data.id){//order.data的food级
							order.data.splice(i,1,orderMsg.data)
							uni.setStorage({
								key:'orderList_'+orderMsg.date,
								data:orders,
								success() {
									console.log('已更新food到',orderMsg.date,'订单',order.data[i])
									uni.showToast({title:'订单已更新'})
									return ;
								},
								fail() {
									uni.showToast({title:'编辑保存错误！',icon:'none'})
									return ;
								}
							})
						}
					}
				}
			},
			fail(res) {
				console.log(res)
			}
		})
	}
}
