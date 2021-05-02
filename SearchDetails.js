export function SearchDetails({$modalTarget}){
    this.initialState = null
    
    this.setState = (nextState) =>{
        this.initialState = nextState
        this.render()
    }   
    
    this.render = () =>{
        const {url} = this.initialState
        $modalTarget.innerHTML = `<div class="modal-img"><img src="${url}"/></div>`
    }

}