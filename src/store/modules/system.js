export default {
    name: 'system',
    namespaced: true,
    state: {
        environmentList: []
    },
    mutations: {
        UPDATE_ENVIRONMENT_LIST(state, environmentList) {
            state.environmentList = environmentList
        }
    }
}