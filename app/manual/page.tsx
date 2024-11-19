import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import slugify from 'slugify'
import markdown from './manual.md'
import './manual.css'

// custom component
const H2 = ({ level, children }:any) => {
    const id = slugify(children.toString(), {lower: true});
    return <h2 id={id}>{children}</h2>;
};
const H3 = ({ level, children }:any) => {
    const id = slugify(children.toString(), {lower: true});
    return <h3 id={id}>{children}</h3>;
};

const CustomTable = ({ node, children, ...props }:any) => {
    return <table className='table'>{children}</table>;
}

export default function Main() {

    return <div className="container">
        <div className="row">
            <div className='col-sm-3'>
                <nav>
                    <li>マニュアル</li>
                </nav>
            </div>
            <div className="col-sm-9">
                <ReactMarkdown 
                components={{
                    h2: H2,
                    h3: H3,
                    table: CustomTable
                }}
                rehypePlugins={[remarkGfm]}>
                    {markdown}
                </ReactMarkdown>
                </div>
        </div>
    </div>
}

