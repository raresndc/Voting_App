%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%Important: Do not change anything in this file!%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\NeedsTeXFormat{LaTeX2e} % We do need LaTeX2e
\ProvidesClass{thesisclass}
\LoadClass[
    fontsize=12pt,
    oneside,
    openany,
    abstract=true,
]{scrreprt}	% Class based on scrbook
%  Style: Add openany to avoid blank pages after every chapter


\usepackage[ngerman,USenglish]{babel}
\usepackage[ngerman,USenglish]{isodate}
\daymonthsepgerman{}%
\monthyearsepgerman{}{}%

%% -------------------------------
%% |      Define commands        |
%% -------------------------------

\newcommand*{\@reviewer}{}
\newcommand*{\reviewer}[1]{\renewcommand\@reviewer{#1}}
\newcommand*{\@advisor}{}
\newcommand*{\advisor}[1]{\renewcommand\@advisor{#1}}
\newcommand*{\@matricle}{}
\newcommand*{\matricle}[1]{\renewcommand\@matricle{#1}}
\newcommand*{\@institute}{}
\newcommand*{\institute}[1]{\renewcommand\@institute{#1}}
\newcommand*{\@type}{}
\newcommand*{\type}[1]{%
    \ifthenelse{\equal{#1}{Bachelor}}%
        {\renewcommand\@type{\iflanguage{english}{Bachelor's Thesis}{Bachelorarbeit}}}{}
    \ifthenelse{\equal{#1}{Master}}%
        {\renewcommand\@type{\iflanguage{english}{Master's Thesis}{Masterarbeit}}}{}
    \ifthenelse{\equal{#1}{Seminar}}%
        {\renewcommand\@type{\iflanguage{english}{Seminar Thesis}{Seminararbeit}}}{}%
}
\newcommand*{\@Author}{\@author}

\renewcommand{\maketitle}{
    \begin{titlepage}
	
	\begin{textblock}{10}[0,0](4,1)
		\iflanguage{english}
		{\includegraphics[width=.5\textwidth]{logos/UniPassau_logo.pdf}}
		{\includegraphics[width=.5\textwidth]{logos/UniPassau_logo.pdf}}
	\end{textblock}
	\begin{textblock}{10}[0,0](10,2.5)
	\end{textblock}
	% \changefont{ppl}{m}{n}
	\vspace*{3.5cm}
	\begin{center}
		\Huge{\scshape \@title}
		% \vspace*{2cm}\\ % reduce vspace if title page spreads over two pages
        \vspace{\fill}
        
		\Large{
			\iflanguage{english}{\@type\\of}			
			{\@type\\von}
		}\\
		\vspace*{1cm}
		\huge{\@Author}\\
		\Large{\@matricle}\\
		% \vspace*{2cm} % reduce vspace if title page spreads over two pages
        \vspace{\fill}
		\Large{
			\iflanguage{english}{University of Passau \\ School of Business, Economics and Information Systems}			
			{Universität Passau \\ Fakultät für Wirtschaftswissenschaften}
			\\
			\@institute
		}
	\end{center}
	\vspace*{\fill} % reduce vspace if title page spreads over two pages
	\Large{
		\begin{center}
			\begin{tabular}[ht]{l c l}

				\iflanguage{english}{Reviewer}{Gutachter}: & \hfill  & \@reviewer \\
				\iflanguage{english}{Advisor}{Betreuender Assistent}: & \hfill  & \@advisor \\
			
			\end{tabular}
		\end{center}
	}
	
	\vspace{\fill} % reduce vspace if title page spreads over two pages
	\begin{center}
        
		\printdate{\@date}
	 \end{center}
	
\end{titlepage}
}

\newcommand{\printdeclaration}{
    \begin{selectlanguage}{ngerman}
    %% ==================
    %DON'T: German is set as default for the declaration, don't change it
    \section*{Eidesstattliche Erklärung}
    %% ==================
    
    Ich versichere hiermit wahrheitsgemäß, die Arbeit selbstständig verfasst und keine anderen als die angegebenen Quellen und Hilfsmittel benutzt, die wörtlich oder inhaltlich übernommenen Stellen als solche kenntlich gemacht und die Satzung der Universität Passau zur Sicherung guter wissenschaftlicher Praxis in der jeweils gültigen Fassung beachtet zu haben. Die Arbeit ist weder von mir noch von einer anderen Person an der Universität Passau oder an einer anderen Hochschule zur Erlangung eines akademischen Grades bereits eingereicht worden. Außerdem erkläre ich, dass ich der Universität ein einfaches Nutzungsrecht zum Zwecke der Überprüfung mittels einer Plagiatssoftware in anonymisierter Form einräume.
    
    \vspace*{1cm}
    \hspace*{4cm} Passau, den {\numdate\printdate{\@date}}  \hspace*{0.5cm}\hrulefill \\
    \hspace*{10.5cm} \@Author \\
    \vspace*{1cm}
    
    Ich versichere hiermit wahrheitsgemäß, dass
    \begin{enumerate}
    \item[\text{\ding{113}}] die Arbeit ohne Zuhilfenahme von ChatGPT oder anderen generativen KI-Werkzeugen erstellt wurde, \underline{oder}
    \item[\text{\ding{113}}] ich in der nachfolgenden Tabelle vollständig dokumentiert habe, wie solche Systeme bei der Entwicklung der Arbeit verwendet wurden.
    \end{enumerate}
    
    \vspace*{1cm}
    \hspace*{4cm} Passau, den {\numdate\printdate{\@date}} \hspace*{0.5cm}\hrulefill \\
    \hspace*{10.5cm} \@Author \\
    
    \pagenumbering{gobble}
    \end{selectlanguage}
    
    \newpage
}

\counterwithout{footnote}{chapter}
\counterwithout{equation}{chapter}
\counterwithout{table}{chapter}
\counterwithout{figure}{chapter}

% \patchcmd{\chapter}{\if@openright\cleardoublepage\else\clearpage\fi}{}{}{}
% \patchcmd{\scr@startchapter}{\if@openright\cleardoublepage\else\clearpage\fi}{}{}{}

%% -------------------------------
%% |          Packages           |
%% -------------------------------

\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage[pdftex]{graphicx}
\usepackage{vmargin}          % Adjust margins in a simple way
\usepackage{subfigure}
\usepackage{url}
\usepackage[absolute,overlay]{textpos}
\usepackage{tikz}
\usepackage{etoolbox}
					
%%  Packages
\usepackage{setspace} % 1.5 line spacing
\onehalfspacing

\usepackage[
    raiselinks=true,
    bookmarks=true,
    bookmarksopenlevel=1,
    bookmarksopen=true,
    bookmarksnumbered=true,
    hyperindex=true,
    plainpages=false,
    pdfpagelabels=true,
    pdfborder={0 0 0.5},
    colorlinks=false,
    pdfusetitle=true,
    linkbordercolor={0 0.61 0.50},   
    citebordercolor={0 0.61 0.50}
]{hyperref}  %{0.57 0.74 0.57}
\AtBeginDocument{
    \hypersetup{
        pdfsubject={\@type}
    }
}

%% --- End of Packages ---



%% -------------------------------
%% |        Declarations         |
%% -------------------------------
\DeclareGraphicsExtensions{.svg}
%% --- End of Declarations ---



%% -------------------------------
%% |         New commands        |
%% -------------------------------
\newcommand{\changefont}[3]{\fontfamily{#1} \fontseries{#2} \fontshape{#3} \selectfont}
%\renewcommand*{\headfont}{\slshape}
%\newcommand{\captionfont}{}
\newcommand{\chapterheadfont}{}
\newcommand{\blankpage}{
 \clearpage{\pagestyle{empty}\cleardoublepage}
}
%% --- End of New Commands ---



%% -------------------------------
%% |      Globale Settings       |
%% -------------------------------
\setcounter{secnumdepth}{3} % Numbering also for \subsubsections
\setcounter{tocdepth}{3}    % Register \subsubsections in content directory

\setpapersize{A4}
\setmarginsrb{3cm}{1cm}{3cm}{1cm}{6mm}{7mm}{5mm}{15mm}

\parindent 0cm                     % Do not indent beginning of paragraph
\parskip1.5ex plus0.5ex minus0.5ex % Margin between paragraphs
%% --- End of global Settings ---



%% -------------------------------
%% |          Headings           |
%% -------------------------------
\pagestyle{plain}
%\pagestyle{fancy}
%\renewcommand{\chaptermark}[1]{\markboth{\thechapter.\ #1}{}}
%\fancyhf{}
%\fancyhead[LE,RO]{{\headfont\thepage}}						% Left/right header for even/odd pages
%\fancyhead[LO]{\headfont\nouppercase{\rightmark}}	% Header for left page (odd)
%\fancyhead[RE]{\headfont\nouppercase{\leftmark}}	% Header for right page (even)
%\fancyfoot[C]{\thepage}
%\renewcommand{\headrulewidth}{0.5pt}
%\renewcommand{\footrulewidth}{0pt}
%\fancypagestyle{plain}{%
%\fancyhf{}													% No Header and Footer fields
%\renewcommand{\headrulewidth}{0pt}
%\renewcommand{\footrulewidth}{0pt}
%\fancyfoot[C]{\thepage}
%}
%% --- End of Headings ---



%% -------------------------------
%% |      Style of captions      |
%% -------------------------------


\renewcommand{\chapter}{%
	\scr@startsection{chapter}%
	{0}		% Structure level
	{0mm}	% Indention
	{2ex plus 1ex minus 1ex}			% Pre-Margin
	{0.5ex plus 0.5ex minus 0.5ex}		% Post-Margin
	{\chapterheadfont\huge}	% Style
}

\renewcommand{\section}{%
\scr@startsection{section}%
{1}		% Structure level
{0mm}	% Indention
{2ex plus 1ex minus 1ex}			% Pre-Margin
{0.5ex plus 0.5ex minus 0.5ex}		% Post-Margin
{\chapterheadfont\Large}	% Style
}
\renewcommand{\subsection}{%
\scr@startsection{subsection}%
{2}		% Structure level
{0mm}	% Indention
{1.5ex plus 1ex minus 0.5ex}		% Pre-Margin
{0.3ex plus 0.3ex minus 0.3ex}		% Post-Margin
{\chapterheadfont\large}	% Style
}
\renewcommand{\subsubsection}{%
\scr@startsection{subsubsection}%
{3}		% Structure level
{0mm}	% Indention
{1.5ex plus 1ex minus 0.5ex}			% Pre-Margin
{0.2ex plus 0.2ex minus 0.2ex}			% Post-Margin
{\chapterheadfont\normalsize}	% Style
}
\renewcommand{\paragraph}{%
\scr@startsection{paragraph}%
{4}		% Structure level
{0mm}	% Indention
{1.3ex plus 1ex minus 0.3ex}			% Pre-Margin
{0.2ex plus 0.2ex minus 0.2ex}			% Post-Margin
{\chapterheadfont\normalsize}	% Style
}
\renewcommand{\subparagraph}{%
\scr@startsection{subparagraph}%
{5}		% Structure level
{0mm}	% Indention
{1ex plus 1ex minus 0.2ex}				% Pre-Margin
{0.1ex plus 0.1ex minus 0.1ex}			% Post-Margin
{\chapterheadfont\normalsize}	% Style
}

\renewcommand{\autodot}{}

%% --- End of captions style ---



% %% ---------------------------------
% %% |   Style of chapter captions   |
% %% ---------------------------------
\newlength{\chapnolen}
\newlength{\chapparlen}
\newsavebox{\chapno}
\renewcommand{\@makechapterhead}[1]{
  %\vspace*{0.2\textheight}
  \vskip 20\p@
  {\parindent \z@ \raggedright \normalfont
    \ifnum \c@secnumdepth >\m@ne
      \if@mainmatter
        \savebox{\chapno}{\chapterheadfont\huge \thechapter.}
        \settowidth{\chapnolen}{\usebox{\chapno}}
        \parbox[t]{\chapnolen}{\usebox{\chapno}}\nobreak\leavevmode
      \fi
    \fi
    \interlinepenalty\@MM
    \setlength{\chapparlen}{\textwidth}
    \addtolength{\chapparlen}{-1.0\chapnolen}
    \addtolength{\chapparlen}{-2ex}
    \leavevmode\nobreak
    \parbox[t]{\chapparlen}{\raggedright\chapterheadfont\huge #1\par\nobreak}
    \vskip 10\p@
  }}

\renewcommand{\@makeschapterhead}[1]{
  %\vspace*{50\p@}
  {\parindent \z@ \raggedright
    \normalfont
    \interlinepenalty\@M
    \chapterheadfont \huge  #1\par\nobreak
    \vskip 40\p@
  }
}
%% --- End of chapter captions style ---



%% ---------------------------------
%% |  Style of content directory   |
%% ---------------------------------
\let\oldtableofcontents\tableofcontents
\renewcommand{\tableofcontents}{{\pdfbookmark{\contentsname}{\contentsname}\chapterheadfont\oldtableofcontents}}
\let\@olddottedtocline\@dottedtocline
\renewcommand{\@dottedtocline}[5]{\@olddottedtocline{#1}{#2}{#3}{#4}{\chapterheadfont #5}}
%% --- End of content directory style ---


%% ----------------------------------
%% |  Style of appendix numbering   |
%% ----------------------------------
 \renewcommand\appendix{\par 
   \setcounter{section}{0}% 
   \setcounter{subsection}{0}% 
   \setcounter{figure}{0}%
   \renewcommand\thesection{\Alph{section}}% 
   \renewcommand\thefigure{\Alph{section}.\arabic{figure}} 
   \renewcommand\thetable{\Alph{section}.\arabic{table}}}
%% --- End of appenix numbering style ---


%% **** END OF CLASS ****
