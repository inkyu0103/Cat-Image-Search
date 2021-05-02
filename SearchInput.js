const ENTER_KEY = 13
export function SearchInput({$target,SearchData}){
    $target.addEventListener("keydown",e=>{
        if (e.keyCode === ENTER_KEY){
            e.target.value.replaceAll(' ','').length===0?alert('아무것도 입력되지 않았습니다.'):SearchData(e.target.value)
            e.target.value =''
        }
    })
}
