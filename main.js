const books=[];
const RENDER_EVENT="render-book";
const SAVED_EVENT="saved-book";
const STORAGE_KEY="BOOKSHELF_APP";

let currentEditId=null;

function generateId(){
    return crypto.randomUUID();
}

function generateBookObject(id,title,author,year,isComplete,cover){
    return {id,title,author,year,isComplete,cover};
}

function findBook(bookId){
    return books.find(book=>book.id===bookId);
}

function findBookIndex(bookId){
    return books.findIndex(book=>book.id===bookId);
}

function saveData(){
    if(isStorageExist()){
        localStorage.setItem(STORAGE_KEY,JSON.stringify(books));
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadData(){
    const serialized=localStorage.getItem(STORAGE_KEY);
    if(serialized){
        const data=JSON.parse(serialized);
        for(const book of data){
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist(){
    return typeof(Storage)!=="undefined";
}

function showToast(message){
    const toast=document.getElementById("toast");
    toast.innerText=message;
    toast.classList.add("show");
    setTimeout(()=>
        { toast.classList.remove("show"); },2000);
}

function addBook(){
    const id=generateId();
    const title=document.getElementById("bookFormTitle").value;
    const author=document.getElementById("bookFormAuthor").value;
    const year=document.getElementById("bookFormYear").value;
    const isComplete=document.getElementById("bookFormIsComplete").checked;
    const bookObject=generateBookObject(id,title,author,year,isComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    showToast(`Buku "${title}" berhasil ditambahkan`);
}

function makeBook(bookObject){

    const container=document.createElement("article");
    container.classList.add("book");

    container.setAttribute("data-bookid",bookObject.id);
    container.setAttribute("data-testid","bookItem");

    // MENU BUTTON (⋮)
    const menuButton=document.createElement("button");
    menuButton.classList.add("menu-button");
    menuButton.innerText="⋮";

    // DROPDOWN MENU
    const menu=document.createElement("div");
    menu.classList.add("book-menu");

    // EDIT BUTTON
    const edit=document.createElement("button");
    edit.innerText="✏️ Edit";

    edit.addEventListener("click",function(e){
        e.stopPropagation();
        openEditModal(bookObject.id);
    });

    // DELETE BUTTON

    const del=document.createElement("button");
    del.innerText="🗑 Hapus";
    del.setAttribute("data-testid","bookItemDeleteButton");

    del.addEventListener("click",function(e){
        e.stopPropagation();
        deleteBook(bookObject.id);
    });
    menu.append(edit,del);
    if(bookObject.isComplete){
    container.classList.add("complete");
    }


    // MENU TOGGLE
    menuButton.addEventListener("click",function(e){
        e.stopPropagation();

        document
        .querySelectorAll(".book-menu").forEach(
            m=>{if(m!==menu) m.classList.remove("show"); });

        menu.classList.toggle("show");
    });

    menu.addEventListener("click",function(e){
        e.stopPropagation();
    });

    // TOGGLE BUTTON
    const toggleButton=document.createElement("button");
    toggleButton.classList.add("toggle-btn");

    if(bookObject.isComplete){
        toggleButton.innerHTML = "✔";
        toggleButton.classList.add("complete");
    } else {
        toggleButton.innerHTML = "✔";
        toggleButton.classList.add("incomplete");
    }


    toggleButton.setAttribute(
        "data-tooltip",
        bookObject.isComplete
            ? "Pindahkan ke Belum selesai"
            : "Tandai sebagai Selesai"
    );

    toggleButton.addEventListener("click",function(e){
        e.stopPropagation();
        toggleBook(bookObject.id);
    });


    // COVER IMAGE
    const image=document.createElement("img");
    image.src=bookObject.cover || "https://picsum.photos/120/160";

    // BOOK TITLE
    const title=document.createElement("h3");
    title.innerText=bookObject.title;
    title.setAttribute("data-testid","bookItemTitle");

    // AUTHOR
    const author=document.createElement("p");
    author.innerText="Penulis: "+bookObject.author;
    author.setAttribute("data-testid","bookItemAuthor");

    // YEAR
    const year=document.createElement("p");
    year.innerText="Tahun: "+bookObject.year;
    year.setAttribute("data-testid","bookItemYear");

    // APPEND
    container.append(
        menuButton,
        menu,
        image,
        toggleButton,
        title,
        author,
        year
    );

return container;
}

function generateDummyBooks(){

    const dummyIncomplete=[
    {id:generateId(),title:"Atomic Habits",author:"James Clear",year:2018},
    {id:generateId(),title:"Deep Work",author:"Cal Newport",year:2016},
    {id:generateId(),title:"The 7 Habits",author:"Stephen Covey",year:1989},
    {id:generateId(),title:"Think and Grow Rich",author:"Napoleon Hill",year:1937},
    {id:generateId(),title:"Start With Why",author:"Simon Sinek",year:2009},
    {id:generateId(),title:"The Power of Habit",author:"Charles Duhigg",year:2012},
    {id:generateId(),title:"Mindset",author:"Carol Dweck",year:2006},
    {id:generateId(),title:"Grit",author:"Angela Duckworth",year:2016},
    {id:generateId(),title:"Drive",author:"Daniel Pink",year:2009},
    {id:generateId(),title:"Essentialism",author:"Greg McKeown",year:2014}
    ];

    const dummyComplete=[
    {id:generateId(),title:"Clean Code",author:"Robert C. Martin",year:2008},
    {id:generateId(),title:"The Pragmatic Programmer",author:"Andrew Hunt",year:1999},
    {id:generateId(),title:"Refactoring",author:"Martin Fowler",year:1999},
    {id:generateId(),title:"Design Patterns",author:"Erich Gamma",year:1994},
    {id:generateId(),title:"You Don't Know JS",author:"Kyle Simpson",year:2015},
    {id:generateId(),title:"Eloquent JavaScript",author:"Marijn Haverbeke",year:2018},
    {id:generateId(),title:"JavaScript: The Good Parts",author:"Douglas Crockford",year:2008},
    {id:generateId(),title:"Cracking the Coding Interview",author:"Gayle McDowell",year:2015},
    {id:generateId(),title:"The Clean Coder",author:"Robert C. Martin",year:2011},
    {id:generateId(),title:"Introduction to Algorithms",author:"Thomas H. Cormen",year:2009}
    ];

    dummyIncomplete.forEach(book=>{
        books.push({
            id:book.id,
            title:book.title,
            author:book.author,
            year:book.year,
            isComplete:false,
            cover:`assets/book5.jpg`
        });
    });

    dummyComplete.forEach(book=>{
        books.push({
            id:generateId(),
            title:book.title,
            author:book.author,
            year:book.year,
            isComplete:true,
            cover:`assets/book5.jpg`
        });
    });
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function toggleBook(bookId){

    const book=findBook(bookId);
    book.isComplete=!book.isComplete;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    showToast(`Berhasil memindahkan buku`);
}

function deleteBook(bookId){

    const confirmDelete=confirm("Yakin ingin menghapus buku?");
    if(!confirmDelete)return;
    const index=findBookIndex(bookId);
    if(index!==-1){
        books.splice(index,1);
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    showToast(`Buku "${book.title}" berhasil dihapus`);
}

function openEditModal(bookId){

    const book=findBook(bookId);

    document.getElementById("editTitle").value=book.title;
    document.getElementById("editAuthor").value=book.author;
    document.getElementById("editYear").value=book.year;
    document.getElementById("editComplete").checked=book.isComplete;
    document.getElementById("editModal").style.display="flex";
    currentEditId=bookId;
}

function closeModal(){
    document.getElementById("editModal").style.display="none";
}

document.getElementById("saveEdit").addEventListener("click",function(){

    const book=findBook(currentEditId);

    book.title=document.getElementById("editTitle").value;
    book.author=document.getElementById("editAuthor").value;
    book.year=document.getElementById("editYear").value;
    book.isComplete=document.getElementById("editComplete").checked;

    closeModal();

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    showToast(`Berhasil mengubah buku`);
});

function updateStats(){

    const total=books.length;
    const complete=books.filter(book=>book.isComplete).length;
    const incomplete=total-complete;

    document.getElementById("totalBooks").innerText=total;
    document.getElementById("completeBooks").innerText=complete;
    document.getElementById("incompleteBooks").innerText=incomplete;
}

function markAllComplete(){
    for(const book of books){
        book.isComplete = true;
    }

    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
    showToast("Semua buku ditandai selesai dibaca 📚");
}

function markAllIncomplete(){
    for(const book of books){
        book.isComplete = false;
    }

    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
    showToast("Semua buku dipindahkan ke belum selesai 📚");
}


document.addEventListener("DOMContentLoaded",function(){
    const submitForm=document.getElementById("bookForm");
    submitForm.addEventListener("submit",function(event){
        event.preventDefault();
        addBook();
        submitForm.reset();
        });

    document.getElementById("toggleDark")
    .addEventListener("click",function(){
        document.body.classList.toggle("dark");
    });

    document.getElementById("resetBooks")
    .addEventListener("click",function(){
        const confirmReset = confirm("Yakin ingin menghapus semua buku?");
        if(!confirmReset) return;
        books.length = 0;
        localStorage.removeItem(STORAGE_KEY);
        document.dispatchEvent(new Event(RENDER_EVENT));
        showToast("Berhasil menghapus semua buku");
    });

    document.getElementById("searchBookTitle")
    .addEventListener("input",function(){

        const keyword=this.value.toLowerCase();
        const filtered=books.filter(
            book=>book.title.toLowerCase().includes(keyword)
        );
        renderFiltered(filtered);
    });

    document.getElementById("markAllComplete").addEventListener("click",markAllComplete);
    document.getElementById("markAllIncomplete").addEventListener("click",markAllIncomplete);

    if(isStorageExist()){
        loadData();
    }

    if(books.length === 0){
        generateDummyBooks();

    // books.push(
    // generateBookObject(generateId(),"Atomic Habits","James Clear",2018,true,"https://picsum.photos/120/160?1"),
    // generateBookObject(generateId(),"Clean Code","Robert C. Martin",2008,true,"https://picsum.photos/120/160?2"),
    // generateBookObject(generateId(),"Eloquent JavaScript","Marijn Haverbeke",2018,false,"https://picsum.photos/120/160?3"),
    // generateBookObject(generateId(),"You Don't Know JS","Kyle Simpson",2015,false,"https://picsum.photos/120/160?4"),
    // generateBookObject(generateId(),"The Pragmatic Programmer","Andrew Hunt",1999,true,"https://picsum.photos/120/160?5"),
    // generateBookObject(generateId(),"JavaScript: The Good Parts","Douglas Crockford",2008,false,"https://picsum.photos/120/160?6")
    // );

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    document.addEventListener("click",function(){
        document.querySelectorAll(".book-menu")
        .forEach(
            menu=>{menu.classList.remove("show");
        });
    });
});

document.addEventListener(RENDER_EVENT,function(){

    const incompleteList=document.getElementById("incompleteBookList");
    const completeList=document.getElementById("completeBookList");
    incompleteList.innerHTML="";
    completeList.innerHTML="";

    for(const book of books){

        const bookElement=makeBook(book);

        if(!book.isComplete){
            incompleteList.append(bookElement);
        }else {
            completeList.append(bookElement);
        }
    }
    updateStats();
});

function renderFiltered(data){

    const incompleteList=document.getElementById("incompleteBookList");
    const completeList=document.getElementById("completeBookList");

    incompleteList.innerHTML="";
    completeList.innerHTML="";

    for(const book of data){
        const bookElement=makeBook(book);
        if(book.isComplete){
            completeList.append(bookElement);
        }else {
            incompleteList.append(bookElement);
        }
    }
}
