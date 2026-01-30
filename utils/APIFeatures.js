

class APIFeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    //filtering
    filter(){
        const excluded = ['page', 'sort', 'limit','fields'];
    
        let newQuery = {...this.queryStr};
        excluded.forEach(el => delete newQuery[el]);

        let queryStr= JSON.stringify(newQuery);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
        newQuery = JSON.parse(queryStr);

        this.query = this.query.find(newQuery);
        return this;
    }
    //sorting
    sort(){
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(',').join(" ");
            this.query = this.query.sort(sortBy)
        }else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    //limiting fields
    limitFields(){
        if(this.queryStr.fields){
            const fields = this.queryStr.fields.split(",").join(" ");
            console.log(fields)
            this.query = this.query.select(fields);
        }else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    //paginatiton
    paginate(){
            const page = this.queryStr.page*1 || 1;
            const limit = this.queryStr.limit || 100;
            const skip = (page - 1) * limit;

            this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}


module.exports = APIFeatures;