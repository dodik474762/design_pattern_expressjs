var ActiveRecord = {
    getColumn: function(params) {
        var column = [];
        for (var item in params) {
            column.push(item);
        }
        return column.join(",");
    },

    getValues: function(params) {
        var values = [];
        for (var item in params) {
            var val = `'${params[item]}'`;
            values.push(val);
        }
        return values.join(",");
    },

    getSetField: function(params) {
        var values = [];
        for (var item in params) {
            var val = params[item];
            var field = item;
            var set_field = `${field} = '${val}'`;
            values.push(set_field);
        }
        return values.join(",");
    },

    getColumnSelect: function(params) {
        var field = [];
        for (var item in params) {
            var val = params[item];
            field.push(val);
        }

        return field.join(',');
    },

    set: function() {
        this.table_name = '';
        this.whereArg = '';
        this.query = '';
        this.join_table = '';
        this.column = '';
        this.operator = '';
        this.orderby = '';
        this.groupby = '';
        this.limit_data = '';
        this.offset_data = '';
        this.top_data = '';
        this.row_num = '';
        return ActiveRecord;
    },

    tableName: function(table_name) {
        this.table_name = table_name;
        return ActiveRecord;
    },

    insert: function(params) {
        var column = ActiveRecord.getColumn(params);
        var values = ActiveRecord.getValues(params);
        this.query = `INSERT INTO ${this.table_name} (${column}) VALUES (${values})`;
        return ActiveRecord;
    },

    update: function(params) {
        var setField = ActiveRecord.getSetField(params);
        this.query = `UPDATE ${this.table_name} set ${setField} `;
        // return this.query;
        return ActiveRecord;
    },

    getAll: function() {
        this.query = `SELECT ${this.top_data} * FROM ${this.table_name} ${this.limit_data}`;
        return ActiveRecord;
    },

    countAll: function() {
        this.query = `SELECT COUNT(*) total FROM ${this.table_name} ${this.limit_data}`;
        return ActiveRecord;
    },

    get: function() {
        if (this.column == '') {
            this.column = '*';
        }
        this.query = `SELECT ${this.top_data} ${this.column} FROM ${this.table_name}`;
        return ActiveRecord;
    },

    select: function(params) {
        this.column = ActiveRecord.getColumnSelect(params);
        return ActiveRecord;
    },

    selectWithRowNum: function(params,  orderby = "id desc"){
        params.push(`ROW_NUMBER() OVER(ORDER BY ${orderby}) as row_num`);
        this.column = ActiveRecord.getColumnSelect(params);
        // console.log(this.column);
        return ActiveRecord;
    },

    join: function(table_join, param_join) {
        this.join_table += `INNER JOIN ${table_join} ON ${param_join}`;
        return ActiveRecord;
    },

    leftJoin: function(table_join, param_join) {
        this.join_table += `LEFT JOIN ${table_join} ON ${param_join}`;
        return ActiveRecord;
    },

    rightJoin: function(table_join, param_join) {
        this.join_table += `RIGHT JOIN ${table_join} ON ${param_join}`;
        return ActiveRecord;
    },

    rawQuery: function(query) {
        this.query = `${query} `;
        return ActiveRecord;
    },

    subQuery: function(){
        var query = ActiveRecord.execute();
        var sub_query = `SELECT * from (
            ${query}
        ) sub ${this.row_num}`;

        return sub_query;
    },

    where: function(field, operator, values, params = {}) {
        params.openBracket = typeof params.openBracket != 'undefined' ? '(' : '';
        params.closeBracket = typeof params.closeBracket != 'undefined' ? ')' : '';


        if (this.whereArg == '') {
            this.whereArg = `WHERE ${params.openBracket} ${field} ${operator} ${values} ${params.closeBracket} `;
        } else {
            this.whereArg += `${params.openBracket} ${this.operator} ${field} ${operator} ${values} ${params.closeBracket} `;
        }
        return ActiveRecord;
    },

    wherelike: function(field, values, params = {}){
        params.openBracket = typeof params.openBracket != 'undefined' ? '(' : '';
        params.closeBracket = typeof params.closeBracket != 'undefined' ? ')' : '';


        if (this.whereArg == '') {
            this.whereArg = `WHERE ${params.openBracket} ${field} LIKE '%${values}%' ${params.closeBracket} `;
        } else {
            this.whereArg += `${params.openBracket} ${this.operator} ${field} LIKE '%${values}%' ${params.closeBracket} `;
        }
        return ActiveRecord;
    },

    and: function() {
        this.operator = `AND `;
        return ActiveRecord;
    },

    or: function() {
        this.operator = `OR `;
        return ActiveRecord;
    },

    limit: function(limit = 1000) {
        this.limit_data = `LIMIT ${limit}`;
        return ActiveRecord;
    },

    top: function(limit = 1000) {
        this.top_data = `TOP ${limit}`;
        return ActiveRecord;
    },

    rowNum: function(first_page = 1, last_page = 1) {
        this.row_num = `where sub.row_num > ${first_page} and sub.row_num <= ${last_page}`;
        if(first_page > last_page){
            this.row_num = `where sub.row_num > ${last_page} and sub.row_num <= ${first_page}`;
        }        
        return ActiveRecord;
    },

    offset: function(offset = '') {
        this.offset_data = `OFFSET ${offset}`;
        return ActiveRecord;
    },

    limitRow: function(last_page = 1, limit = 1){
        this.row_num = `LIMIT ${last_page}, ${limit}`;
        return ActiveRecord;
    },

    orderBy: function(params = '') {
        params = params == '' ? '' : `ORDER BY ${params}`
        this.orderby = params;
        return ActiveRecord;
    },

    groupBy: function(params = '') {
        params = params == '' ? '' : `GROUP BY ${params}`
        this.groupby = params;
        return ActiveRecord;
    },

    paginate: function(limit = 10, total = 1000, params = {}) {
        var page = ActiveRecord.getPaginationData(limit, total, params);
        if (page.length > 0) {
            var offset = typeof params.offset === 'undefined' ? 0 : params.offset;
            ActiveRecord.limit(limit).offset(offset);
        }

        return {
            'page': page,
            'query': ActiveRecord.execute()
        };
    },

    seek: function(no = 1){
        this.page = no;
        return ActiveRecord;
    },

    paginateSql: function(limit = 0, total_data = 1, withLimit = false){
        var seek = 1;
        if(this.page != ''){
            seek = this.page;
        }

        var result = [];
        for(var i = 1; i <= total_data; i++){                        
            if((i % limit) == 0){
                var data_page = [];
                for(var x = i; x > (i - limit - 1); x--){
                    data_page.push(x);
                }
                result.push(data_page);
            }
        }

        if(result.length > 0){
            var last_page = result[(result.length) -1];
            last_data = last_page[0];

            //sisa data
            var data_page = [];
            for(var i = last_data; i <= total_data; i++){
                data_page.push(i);
            }

            result.push(data_page);
        }

        var data_pg = [];
        var lst_pg = 1;
        if(result.length > 0){                        
            for(var i = 0; i < result.length; i++){
                var no_page = i +1;
                var params = {};
                params.page = no_page;
                params.fetch = result[i];
                params.active = seek == no_page ? 'active' : '';
                
                if(params.active == 'active'){
                    lst_pg = no_page;
                }

                if(seek == no_page){
                    var last_page = result[i][0];
                    var first_page = result[i][(result[i].length) -1];
                    if(!withLimit){
                        ActiveRecord.rowNum(first_page, last_page);
                    }else{
                        if(first_page < last_page){
                            last_page = first_page;
                        }
                        ActiveRecord.limitRow(last_page, limit);
                    }                    
                }
                data_pg.push(params);
            }
        }        

        this.setMaxData = data_pg.length;
        lst_pg = (lst_pg * limit) - limit +1;
        // console.log('active', lst_pg);
        return {
            'page': data_pg,
            'last_page': lst_pg,
            'paging_content': this.renderPaginationView(),
            'query': this.subQuery(),            
        };
    },

    renderPaginationView: function(){
        var seek = this.page;
        if(seek > this.setMaxData){
            seek -=1;
        }

        // console.log('seek', seek);
        var page_active = seek;
        var ul_open = '<ul class="pagination">';
        var prev = '';
        if(seek > 1){
            prev = `<li class=""><a href="?page=${page_active -1}&link=prev">PREV</a></li>`;
        }   
        var next = '';
        if(seek < this.setMaxData){
            next = `<li class=""><a href="?page=${page_active+1}&link=next">NEXT</a></li>`;
        }        
        var ul_close = "</ul>";

        var view = ul_open+prev+next+ul_close;
        return view;
    },

    getPaginationData: function(limit, total, params) {
        var page_active = typeof params.page === 'undefined' ? 1 : params.page;
        var page_total = parseInt(total / limit);
        var sisa_data = page_total * limit;
        sisa_data = total - sisa_data;
        page_total = sisa_data > 0 ? page_total += 1 : page_total;
        var page = [];
        var segment_page = [];

        if(params.last == 'none'){
            for(var x = parseInt(params.first); x < (parseInt(params.segment)+parseInt(params.first)); x++){
                segment_page.push(x);
            }
        }else{
            
            // var batas_atas = parseInt(params.last)*2;
            for(var x = parseInt(params.first); x < (parseInt(params.first)+parseInt(params.segment)); x++){
                segment_page.push(x);
            }
        }               

        for (var i = 0; i < page_total; i++) {
            var offset = i * limit;
            var no = i + 1;
            var from_data = total;
            var display = limit * no;
            var include = segment_page.includes(no);            
            var last_page = no%parseInt(params.segment) == 0 ? no: 'none';            
            var first_page = 1;

            if(no > parseInt(params.segment)){
                var counter = no +1;
                var getFirstPage = no % parseInt(params.segment);
                if((no % parseInt(params.segment)) == 0){
                    getFirstPage = 1;
                }                
                first_page = no - getFirstPage;
                
                if((counter % 3) == 0){
                    // if(no == 6){
                        // console.log(no+' counter', counter);
                    // }
                    first_page += getFirstPage;
                }

                last_page = counter%parseInt(params.segment) == 0 ? no: 'none';
            }else{
                if(no == parseInt(params.segment)){
                    first_page = parseInt(params.segment);                    
                }
            }

            page.push({
                'no': no,
                'link': `?page=${no}&limit=${limit}&offset=${offset}&from_data=${from_data}&display=${display}&last=${last_page}&first=${first_page}`,
                'display': display,
                'from_data': from_data,
                'active': page_active == no ? 'active' : '',
                'segment': include
            });
        }

        return page;
    },

    execute: function() {
        var queryBuilder = 
        `${this.query} 
        ${this.join_table} 
        ${this.whereArg} 
        ${this.groupby} 
        ${this.orderby} 
        ${this.limit_data} 
        ${this.offset_data} `;
        return queryBuilder.trim();
    }
};

module.exports = ActiveRecord;