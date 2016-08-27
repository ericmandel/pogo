IFILES	= pogo1.html pogo2.html pogo_center_top.html \
	  pogo.js pogosupport.js pogosupport.css \
	  indentbg_grey.png indentbg2_grey.png
WFILES	= pogoXeq
AFILES	= pogoAnalysis.json
XFILES	= pogoFlux
IDIR	= pogo
BASE	= /pogo

JSDIR	= ../js9/js
JSFILES =	$(JSDIR)/jquery.min.js $(JSDIR)/jquery-ui.min.js $(JSDIR)/jquery.flot.min.js $(JSDIR)/jquery.flot.errorbars.min.js $(JSDIR)/jquery.flot.navigate.min.js $(JSDIR)/jquery.flot.selection.min.js $(JSDIR)/flot-zoom.min.js $(JSDIR)/sprintf.min.js $(JSDIR)/tabcontent.js $(JSDIR)/jquery.flot.axislabels.js
CSSDIR	= ../js9/css
CSSFILES =	$(CSSDIR)/tabcontent.css

all:	FORCE
	@echo "nothing to do for all (did you mean: make install?)"

install: clean
	@(XX=`ls -ltrd ../js9* | tail -1 | awk '{print $$NF}'`; \
          JDIR=`egrep "WEBDIR *=" $$XX/Makefile | awk '{print $$3}'`; \
	  if [ ! -d "$$JDIR" ]; then \
	    echo "ERROR: could not find JS9 directory: $$JDIR"; \
	    exit; \
	  fi; \
	  TOP=`dirname $$JDIR`; \
	  if [ -d $$TOP ]; then \
	    echo "installing $(IDIR) in: $$TOP"; \
	    mkdir -p $$TOP/$(IDIR);   \
	    echo "installing $(IFILES) in: $$TOP/$(IDIR)"; \
	    cp -p $(IFILES) $$TOP/$(IDIR)/.; \
	    echo "installing $(WFILES) $(AFILES) in: $$JDIR"; \
	    cp -p $(WFILES) $$JDIR/analysis-wrappers/.; \
	    cp -p $(AFILES) $$JDIR/analysis-plugins/.; \
	    if [ -d "$(BASE)" ]; then \
	        BASE=$(BASE); \
	    else \
	        BASE=$$HOME; \
	    fi; \
	    echo "installing $(XFILES) in: $$BASE/bin"; \
	    cp -p $(XFILES) $$BASE/bin/.; \
	  else \
	    echo "ERROR: could not find directory: $$TOP"; \
	  fi;)

pogosupport:	FORCE
		@(echo "remaking pogosupport ..."; \
		  echo "css files in pogosupport.css: " > pogosupport.txt; \
		  echo $(CSSFILES) >>  pogosupport.txt; \
		  cat $(CSSFILES)  >  pogosupport.css;  \
		  echo "js files in pogosupport.js: " >> pogosupport.txt; \
		  echo $(JSFILES)  >> pogosupport.txt; \
		  cat $(JSFILES)   >  pogosupport.js;)

eslint:	FORCE
	eslint pogo.js

clean:	FORCE
	@rm -f foo* *~

tar:	clean
	@(mkdir -p pogo; cp -p $(IFILES) pogo/.; tar cf - pogo | gzip -c > ../pogo.tar.gz; rm -rf pogo)

FORCE:
