import {SearchInput} from "./SearchInput.js"
import {SearchResult} from "./SearchResult.js"
import {SearchDetails} from "./SearchDetails.js"

const ESC_KEYCODE = 27

export function App(){
    const $isLoadingTarget = document.querySelector(".loader")
    const $modalTarget = document.querySelector(".modal-target")
    const $mainTarget = document.getElementsByTagName("body")[0]
    let tmpKeyword;

    /* states */
    this.initialDataState = []
    
    const SearchById = async(cat_id)=>{
            const response = await fetch(`https://api.thecatapi.com/v1/images/${cat_id}`)
            const returnObj = response.json()
            return returnObj
    }

    const SearchData = async(catKeyword) =>{
        $isLoadingTarget.classList.toggle("show") 
        tmpKeyword = catKeyword
        try{
            const preResponse = await fetch(`https://api.thecatapi.com/v1/images/search?q=${catKeyword}&limit=10`)
            if (preResponse.ok && preResponse.status === 200){
                const res = await preResponse.json()
                
                if(res.length === 0){
                    alert("검색 결과가 존재하지 않습니다.")
                }

                $isLoadingTarget.classList.toggle("show")
                this.setState(res)                
            }


        }catch(err){
            console.log(err)
        }        
    }
    
    const AddData = async() =>{
        const preRespnse = await fetch(`https://api.thecatapi.com/v1/images/search?q=${tmpKeyword}&limit=10`)
        const res = await preRespnse.json() 
        this.setState([...this.initialDataState,...res])
    }


    this.setState = (nextState) =>{
        this.initialDataState = nextState
        this.SearchResult.setState(this.initialDataState)
        this.render()
    }

    this.render = () =>{
        this.SearchResult.render()        
    }

    /* Event delegation */
    document.querySelector(".result-container").addEventListener("click",async(e)=>{
        const cat_id = e.target.closest("div").id
        const cat_id_data = await SearchById(cat_id)
        console.log(cat_id_data)
        // 여기서 
        this.SearchDetalis.setState(cat_id_data)

        $mainTarget.style.overflow = "hidden"
        $modalTarget.classList.toggle("show")
    })

    $modalTarget.addEventListener("click",e=>{
        if(e.target===e.currentTarget){
            $mainTarget.style.overflow = "visible"
            $modalTarget.classList.toggle("show")    
        }
    })

    window.addEventListener("keydown",e=>{
        if(e.keyCode === ESC_KEYCODE && $modalTarget.classList.contains("show")){
            $mainTarget.style.overflow = "visible"
            $modalTarget.classList.toggle("show")
        }
    })

    document.addEventListener("scroll",async (e)=>{
        const { clientHeight, scrollTop, scrollHeight} = e.target.scrollingElement
        if (clientHeight + scrollTop >= scrollHeight){
            await AddData()
        }
    })

  

    this.SearchInput = new SearchInput({$target : document.querySelector("#input"),SearchData})
    this.SearchResult = new SearchResult({$target: document.querySelector(".result-container"),isLoading : this.isLoadingState,$isLoadingTarget:document.querySelector(".loader")})
    this.SearchDetalis = new SearchDetails({$modalTarget,render_data:null})
}
