import "../components/home/homepage.css";
import { bookCoverPhoto } from "./bookcoverphoto";
import React from "react";
import Pagination from 'react-bootstrap/Pagination'
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';
class Shop extends React.Component {
    

    constructor(props){
        super(props);
    
        this.state = {
            booklist:[],
            bookListPage:[],
            categories:[],
            authors:[],
            sortsale:[],
            links:[],
            current_sort: 'on_sale',
            current_cate: '',
            current_page:'1',
            current_cate_id:'',
            book_paginate:'',
            current_author: '',
            current_author_id:'',
        };
    }
    async componentDidMount(){
        const getlink = await axios.get('http://127.0.0.1:8000/api/books/onsale').then(respone =>{
            this.setState({links:respone.link});
        })
        const category = await axios.get(' http://127.0.0.1:8000/api/categories').then(respone=>{
            this.setState({categories:respone.data});
        });
        const author = await axios.get('http://127.0.0.1:8000/api/authors').then(respone=>{
            this.setState({authors:respone.data});
        });
        await Promise.all([getlink,category,author,this.sortsale()]);
        
    }
    // http://127.0.0.1:8000/#/shop?cate

    handChangePage = (e) => {
        this.setState({ currentpage: e.target.text.split(" ")[0] });
        const page = e.target.text.split(" ")[0];
        if(this.state.current_cate ==='' && this.state.current_author === ''){
            switch(this.state.current_sort) {
                case 'on_sale':
                    this.sortsale(page);
                    break;
                case 'popular':
                    this.sortpopular(page);
                    break;
                case 'price_asc':
                    this.sortpriceincrease(page);
                    break;
                case 'price_desc':
                    this.sortpricedecrease(page);
                    break;
                default:
                    this.sortsale(page);
            }
        
        }
        if(this.state.current_cate !== ''){
            this.booksOfCate(this.state.current_cate_id,page)
        }
        if(this.state.current_author !== ''){
            this.booksOfAuthor(this.state.current_author_id,page)
        }


        // switch(this.state.current_cate){
        //     case '1' :
        //         this.booksOfCate( ,e.target.text.split(" ")[0] );
        //     default:
        //         this.sortsale(e.target.text.split(" ")[0]);
        // }
        // console.log("page",e.target.text.split(" "));
     
     }
     sortsale = async (pageNumber =1) => {
        this.setState({ current_sort: 'on_sale' });
        // console.log("Running...");
        const sale = `http://127.0.0.1:8000/api/books/onsale?page=${pageNumber}`;
        const sortsale = await axios.get(sale);
        // console.log('d',pag);
        this.setState({bookListPage: sortsale.data});
    }
    sortpopular = async (pageNumber =1) => {
        //console.log("run");
        this.setState({ current_sort: 'popular' });
        // console.log("Running...");
        const sale = `http://127.0.0.1:8000/api/books/onpopular?page=${pageNumber}`;
        const sortsale = await axios.get(sale);
        // console.log('d',pag);
        this.setState({bookListPage: sortsale.data});
    }
    sortpricedecrease = async (pageNumber =1) => {
        this.state.current_sort ='price_desc'
        // console.log("Running...");
        const sortdecrease = `http://127.0.0.1:8000/api/books/pricedecrease?page=${pageNumber}`;
        const decrease = await axios.get(sortdecrease);
        // console.log('d',pag);
        this.setState({bookListPage: decrease.data});
    }
    sortpriceincrease = async (pageNumber =1) => {
        this.state.current_sort ='price_asc'
        // console.log("Running...");
        const sortincrease = `./api/books/priceincrease?page=${pageNumber}`;
        const increase = await axios.get(sortincrease);
        // console.log('d',pag);
        this.setState({bookListPage: increase.data});
    }
    booksOfCate = async (e,pageNumber=1)=>{
        console.log("Runningg...",e);
        console.log("Page",pageNumber);
        this.setState({ current_cate_id: e }) ;
        this.setState({ current_cate: 'cate' }) ;
        const cate1 = `./api/category/${e}/books?page=${pageNumber}`;
        const bookcate = await axios.get(cate1);
        this.setState({bookListPage: bookcate.data});
    }
    booksOfAuthor = async (e,pageNumber=1)=>{
        console.log("Runningg...",e);
        console.log("Page",pageNumber);
        this.setState({ current_author_id: e }) ;
        this.setState({ current_author: 'auth' }) ;
        const auth = `./api/author/${e}/books?page=${pageNumber}`;
        const bookauth = await axios.get(auth);
        this.setState({bookListPage: bookauth.data});
    }

    renderUserList(){
        
        // const {data, current_page,per_page,total}=this.state.users ;
        const bookListPage =  (this.state.bookListPage);
        //console.log('rf',bookListPage);

        const  bookList=bookListPage.data;
        //console.log(typeof bookList)

        console.log(bookList);
        
        // console.log(products);
      
        return (
            <React.Fragment>
            <div id="mainRow" className="row">
            
            {bookList && bookList.map((book1) => (
                <>
                 <a href={`/#/product/${book1.id}`}  className="col-lg-3 col-md-4 col-sm-6 mb-4" key={book1.id}>
                          <div className="fiximg"> 
                          <div className="card">
                             <img className="card-img-top img-fluid" src={bookCoverPhoto[book1.book_cover_photo]} alt={book1.book_cover_photo} />
                                 <div className="card-body">
                                 <div className="text-decoration-none"><p className="book-title font-18px ">{book1.book_title}</p></div>
                                      <p className="book-author font-14px">{book1.author_name}</p>
                                 </div>
                         <div className="card-footer text-muted font-14px"><strike>{book1.book_price}$</strike>&nbsp;<b>{book1.finalprice}$</b></div>
                         </div>
                         </div>
                </a>

                </>
            
            ))}
                </div> 
         
            </React.Fragment>
        )

            

    }
    render() {
        const {users} = this.state ;
        const bookListPage =  (this.state.bookListPage);
        const bookPageination=bookListPage.last_page;
        return (
            <section> 
                <div className="container">
                    <div className="row">
                            <div className="col-md-12 title-shop-page">
                                <p> <b>Books</b></p>
                                <hr/> 
                            </div>
                    </div>
                    
                    <div className="row shop-page-list">
                        <div className="col-md-2">
                            <div className="row">
                                <div className="col-md-12">
                                <div class="accordion" id="accordionExample">
                                    <div class="accordion-item">
                                        <h3 class="accordion-header" id="headingOne">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            Category
                                        </button>
                                        </h3>
                                        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                        <div class="accordion-body">
                                                <table className="table">
                                                <tbody>
                                                {
                                                    this.state.categories.map(cate => {
                                                        return (
                                                            <tr><td><a onClick ={()=>this.booksOfCate(cate.id)}>{cate.category_name}</a></td></tr>
                                                        )
                                                    })
                                                }
                                                </tbody>
                                                </table>
                                        </div>
                                        </div>
                                    </div>
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="headingTwo">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                            Author
                                        </button>
                                        </h2>
                                        <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                        <div class="accordion-body">
                                            <table className="table">
                                                <tbody>
                                                {
                                                    this.state.authors.map(auth => {
                                                        return (
                                                            <tr><td><a onClick ={()=>this.booksOfAuthor(auth.id)}>{auth.author_name}</a></td></tr>
                                                        )
                                                    })
                                                }
                                                </tbody>
                                                </table>                                        
                                        </div>
                                        </div>
                                    </div>
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="headingThree">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                            Star
                                        </button>
                                        </h2>
                                        <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                        <div class="accordion-body">
                                        <table className="table">
                                                <tbody>
                                                    <tr><td><a href="#">1 Star</a></td></tr>
                                                    <tr><td><a href="#">2 Star</a></td></tr>
                                                    <tr><td><a href="#">3 Star</a></td></tr>
                                                    <tr><td><a href="#">4 Star</a></td></tr>
                                                    <tr><td><a href="#">5 Star</a></td></tr>
                                                </tbody>
                                                </table>                                        
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-md-10">
                            <div className="row">
                                {/* <div className="col-md-3">
                                    showing 1-12 of 126 books
                                </div> */}
                                <div className="col-md-9">
                                   <div className="row">
                                    <div className="col-md-6">
                                    <div class="btn-group btn-sort1">
                                        <button class="btn btn-secondary dropdown-toggle " type="button" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                                           Sort By 
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="defaultDropdown">
                                            <li><a class="dropdown-item" onClick ={()=>this.sortsale()}>Sort By Sale</a></li>
                                            <li><a class="dropdown-item" onClick ={()=>this.sortpopular()}>Sort By Popular</a></li>
                                            <li><a class="dropdown-item" onClick ={()=>this.sortpriceincrease()}>Sort By Price Low to High</a></li>
                                            <li><a class="dropdown-item" onClick ={()=>this.sortpricedecrease()}>Sort By Price High to Low</a></li>
                                        </ul>
                                    </div>
                                   
                                    </div>
                                    <div className="col-md-6">
                                    

                                    

                                    <div class="btn-group btn-sort2">
                                    <button class="btn btn-secondary dropdown-toggle" type="button" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                                        Show
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="defaultDropdown">
                                        <li><a class="dropdown-item" href="#">10</a></li>
                                        <li><a class="dropdown-item" href="#">20</a></li>
                                        <li><a class="dropdown-item" href="#">30</a></li>
                                    </ul>
                                    </div>
                                    </div>
                                   </div>
                                </div>
                                <div className="book-list">
                                <div className="col-md-12"> 
                                <div class="card card-body">
                                    
                            <div id="mainRow" className="row">
                                    {this.renderUserList()}
                                
                            </div>
                        </div>
                                </div>
                                </div>

                                <div className="pag"style={{ display: 'block', width: 700, padding: 30 }}>
                        <Pagination>
                        {/* <Pagination.Prev />
                        <Pagination.Ellipsis /> */}
                        {

                             
                            (bookPageination && Array.apply(null, Array(bookPageination)).map((val, idx)=>{


                                return( 
                                <Pagination.Item
                                key={`${idx}`}
                                onClick={(e) => this.handChangePage(e)}                        
                                > 
                                {
                                    idx+1 
                                }
                                 
                                
                                </Pagination.Item>)
                               
                            }))
                        }
                    </Pagination>                                

                    </div>
                            </div>
                        </div>
                    </div>
                    

                </div>
                
            </section>

        );
    }
}

export default Shop;  