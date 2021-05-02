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
        /* 
        문제 발생 
        - 검색창에서 데이터를 검색 할 때와 스크롤을 다 내려서 데이터를 받아 올 때 처리하는 방식이 달라야 하나?
        - 스크롤을 다 내리는 경우에는 이전 내용을 유지한 채로 계속 데이터를 붙여가야 한다.
        - 그렇지 않은 경우에는 새롭게 결과를 보여줘야 한다.
        - tmpKeyword를 이용한 트릭을 사용하면 되지 않을까?
        - tmpKeyword가 이전과 같지 않으면 . . .  
        - 아 또 모달 열린 상태에서 
        */
        $isLoadingTarget.classList.toggle("show") 
        tmpKeyword = catKeyword
        let tmpState = []
        await fetch(`https://api.thecatapi.com/v1/images/search?q=${catKeyword}&limit=10`)
        .then(res =>{
            if (res.ok){
                return res.json()
            }
            throw new Error('network response was not ok')
        }) // respoese 객체
        .then(result => {
            result.forEach(ele=>{
                // 이렇게 하는거 쪼금 맘에 안 드는데
                const {id,url} = ele
                tmpState.push({id,url})
            })
        })
        .catch(err => console.log(err)) 
        $isLoadingTarget.classList.toggle("show")
        this.setState(tmpState)
    }
    
    /* App 컴포넌트에서 여러곳으로 뿌리는 역할.*/

    /* nextState는 새로운 array-like로 입력받는다.*/
    this.setState = (nextState) =>{
        this.initialDataState = [...nextState]
        console.log(this.initialDataState)
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

    document.addEventListener("scroll",e=>{
        const { clientHeight, scrollTop, scrollHeight} = e.target.scrollingElement
        if (clientHeight + scrollTop >= scrollHeight){
            alert("하이")
        }
    })

  

    this.SearchInput = new SearchInput({$target : document.querySelector("#input"),SearchData})
    this.SearchResult = new SearchResult({$target: document.querySelector(".result-container"),isLoading : this.isLoadingState,$isLoadingTarget:document.querySelector(".loader")})
    this.SearchDetalis = new SearchDetails({$modalTarget,render_data:null})
}
