import ButtonEx from "../ButtonEx/ButtonEx.tsx";
import axios from "axios";
import glob from "../../glob.ts";
import Reports from "./Reports.tsx";

function TestReports({code, setCode}) {
    return <ButtonEx className="btn btn-secondary" onAction={() => {
        axios.get(glob.hostAPI + 'report-excel/' + 'day' + '?date=02.03.25&num=4&fileName=отчет')
    }}>Тест</ButtonEx>
}

export default TestReports;