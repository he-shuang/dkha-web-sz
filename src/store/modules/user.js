export default {
    state: {
        id: 0,
        name: '',
        realName: '',
        roleNames:'',
        superAdmin: 0,
        roles: [],
        defaultCheckedKeys: '',
        valGoout: {
            df_type: '',
            df_floorid: ""
        },
        valRoom: {
            df_type: '',
            df_floorid: ""
        },
        defaultCheckedKeyss: '',
        isFullScreen: false,
        // floorId:''
    },
    mutations: {
        SET_FULL_SCREEN(state, isFullScreen) {
          state.isFullScreen = isFullScreen
        },
        
      },
}