const getters = {
    roles: state => state.user.roles,
    uwbId: state => state.visitor.uwbId,
    environmentList: state => state.system.environmentList,
    isFullScreen: state => state.user.isFullScreen,
}
export default getters