export default {
  name:'visitor',
  namespaced:true,
  state:{
    uwbId:''
  },
  mutations:{
    UPDATE_VISITOR(state,uwbId){
      state.uwbId=uwbId
    }
  }
}