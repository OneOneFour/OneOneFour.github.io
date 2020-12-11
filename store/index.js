export const state = () => ({
    night:false,
    pane:true
})
export const mutations = {
    toggleNight(state,mode){
        let root = document.documentElement;
        if(state.night){
          root.style.setProperty('--black','black');
          root.style.setProperty('--white','white');
        }else{
          root.style.setProperty('--black','white');
          root.style.setProperty('--white','black');
        }
        state.night = !state.night
        localStorage.setItem('night',state.night)
    },
    changePane(state,mode){
        state.pane = mode
    }
}