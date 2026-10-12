// The PDFs are built from resume/*.tex (see resume/build.sh); Vite copies them into the bundle.
import ptBr from "../../../resume/resume-pt.pdf?url";
import enUs from "../../../resume/resume-en.pdf?url";

export const resumeUrl = { ptBr, enUs };
