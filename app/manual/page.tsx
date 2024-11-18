import ReactMarkdown from 'react-markdown'
import markdown from './manual.md'

export default function Main() {
    
    return <div className="container">
    <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
}

