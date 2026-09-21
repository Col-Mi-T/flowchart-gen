use wasm_bindgen::prelude::*;
use serde::Serialize;
use serde_wasm_bindgen::to_value;


#[derive(Serialize, Debug)]
struct Node {
    id: usize,
    node_type: NodeType,
    code: String,
    lineno: usize,
    scope_id: usize,
    //links: Vec<usize>
}

#[derive(Debug, Serialize)]
enum NodeType {
    Output,
    Input,
    Start,
    End,
    Import,
    ProcessFunction,
    ProcessData,
    SubroutineCall,
    SubroutineDecl,
    DecisionTrue,
    DecisionFalse,
    DecisionLoop
}



#[wasm_bindgen]
pub fn create_chart(code:String,lang:String) -> JsValue {
    //code.to_string();
    let objects;
    match lang.as_str(){
        "python" => {
            objects = python(code.as_str());
            //json(objects);
        },
        &_ => todo!()
    }
    to_value(&objects).unwrap()
}

fn remove_multiline_comments(code:&str, mut in_comment:bool)-> Vec<(bool, &str)>{
    let mut c_num = 0;
    for c in code.split_whitespace(){
        //println!("{}",c);
        if c == "#" {
            c_num += 1;
        };
    }
    if c_num % 2 == 1{ // odd
        if in_comment == false {
            in_comment = true;
        }else if in_comment == true{
            in_comment = false;
        }
    }else if c_num % 2 == 0{ // even
        if in_comment == false{
            in_comment = false;
        }else if in_comment == true{
            in_comment = true;
        };
    };
    //println!("{}",code);
    //println!("{}",in_comment);
    let mut ret = Vec::new();
    ret.push((in_comment,code));
    ret
}

fn create_node(node_type:NodeType, line:&str, lineno:usize, id:usize, scope_id:usize) -> Node{
    let node = Node{
                id : id,
                node_type: node_type,
                code : line.to_string(),
                lineno : lineno,
                scope_id:scope_id
                //links : links
            };
    node
}



fn python(file:&str) -> Vec<Node>{
    
    // Initialise Line number, node id, nodes vector
    let mut lineno = 0;
    let mut id = 0;
    let mut nodes = Vec::new();
    //let mut in_scope = false;
    let mut scope_id = 0;

    let n = create_node(NodeType::Start, "start", lineno, id, scope_id);
    nodes.push(n);
    // Itterate through the code per line
    for line in file.lines(){

        // Count Line number first
        lineno+=1;

        // Ignore empty lines
        if line.is_empty(){
            continue 
        } //else{
           // if line.starts_with("\t") && in_scope == false{
            //    in_scope = true
           // }
            //Node id
            id+=1; 

            // Remove comments
            let code = line.split("#").next().unwrap_or(""); 

            // Remove extra spaces
            let c = code.trim();

            // Get first token on the line
            let first = c.split_whitespace().next().unwrap_or("");
            let second = c.split_whitespace().nth(1).unwrap_or("");
            let third = c.split_whitespace().nth(2).unwrap_or("");
            let var_function = third.split("(").next().unwrap_or("");
            let module = first.split(".").next().unwrap_or("");
            //println!("{:?}",first);

            // Create Node Object and add to 'nodes' vector
            if first.starts_with("print"){
                let n = create_node(NodeType::Output, c, lineno, id, scope_id);
                nodes.push(n);
            }else if first == "if"{
                let n = create_node(NodeType::DecisionTrue, c, lineno, id, scope_id);
                nodes.push(n);
                //in_scope = true;
                scope_id = id
            }else if first.starts_with("else"){
                let n = create_node(NodeType::DecisionFalse, c, lineno, id, scope_id);
                nodes.push(n);
                //in_scope = true;
                scope_id = id
            }else if first == "for" || first == "while"{
                let n = create_node(NodeType::DecisionLoop, c, lineno, id, scope_id);
                nodes.push(n);
                //in_scope = true;
                scope_id = id
            }else if first == "import"{
                let n = create_node(NodeType::Import, c, lineno, id, scope_id);
                nodes.push(n);
            }else if !module.is_empty() && second.is_empty(){
                let n = create_node(NodeType::SubroutineCall, c, lineno, id, scope_id);
                nodes.push(n);
            }else if second == "=" && third.starts_with("input"){
                let n = create_node(NodeType::Input, c, lineno, id, scope_id);
                nodes.push(n);
            }else if second == "=" && !var_function.starts_with("input") && !var_function.is_empty(){
                let n = create_node(NodeType::ProcessFunction, c, lineno, id, scope_id);
                nodes.push(n);
            }else if second == "=" && var_function.is_empty(){
                let n = create_node(NodeType::ProcessData, c, lineno, id, scope_id);
                nodes.push(n);
            }else {
                // Reserve id for useful nodes
                id-=1;
            };
            //in_scope = false;
        
    };
    let n = create_node(NodeType::End, "end", lineno, id, scope_id);
    nodes.push(n);
    nodes
}