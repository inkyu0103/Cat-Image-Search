export function SearchResult ({$target}) {
    this.initialState = []
    
    this.setState = (nextState) =>{
        this.initialState = [...this.initialState,...nextState]
        this.render()
    }

    this.render = () =>{
        $target.innerHTML = this.initialState.map(ele =>{
            const {url,id} = ele
            console.log(url)
            return `<div id="${id}"><img src="${url}"/></div>`
        }).join("")
    }
}