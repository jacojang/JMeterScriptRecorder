var getHeaderStr = function() {
	return '<?xml version="1.0" encoding="UTF-8"?>' +
			'<jmeterTestPlan version="1.2" properties="2.8" jmeter="2.13 r1665067">' +
			'  <hashTree>' +
			'    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="Test Plan" enabled="true">' +
			'      <stringProp name="TestPlan.comments"></stringProp>' +
			'      <boolProp name="TestPlan.functional_mode">false</boolProp>' +
			'      <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>' +
			'      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">' +
			'        <collectionProp name="Arguments.arguments"/>' +
			'      </elementProp>' +
			'      <stringProp name="TestPlan.user_define_classpath"></stringProp>' +
			'    </TestPlan>' +
			'    <hashTree>' +
			'      <CookieManager guiclass="CookiePanel" testclass="CookieManager" testname="HTTP Cookie Manager" enabled="true">' +
			'        <collectionProp name="CookieManager.cookies"/>' +
			'        <boolProp name="CookieManager.clearEachIteration">false</boolProp>' +
			'      </CookieManager>' +
			'      <hashTree/>' +
			'      <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="Thread Group" enabled="true">' +
			'        <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>' +
			'        <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">' +
			'          <boolProp name="LoopController.continue_forever">false</boolProp>' +
			'          <stringProp name="LoopController.loops">1</stringProp>' +
			'        </elementProp>' +
			'        <stringProp name="ThreadGroup.num_threads">1</stringProp>' +
			'        <stringProp name="ThreadGroup.ramp_time">1</stringProp>' +
			'        <longProp name="ThreadGroup.start_time">1460940930000</longProp>' +
			'        <longProp name="ThreadGroup.end_time">1460940930000</longProp>' +
			'        <boolProp name="ThreadGroup.scheduler">false</boolProp>' +
			'        <stringProp name="ThreadGroup.duration"></stringProp>' +
			'        <stringProp name="ThreadGroup.delay"></stringProp>' +
			'      </ThreadGroup>' +
			'      <hashTree>';
};

var getFooterStr = function() {
	return	'<ResultCollector guiclass="SummaryReport" testclass="ResultCollector" testname="Summary Report" enabled="true">\n' +
			'          <boolProp name="ResultCollector.error_logging">false</boolProp>\n' +
			'          <objProp>\n' +
			'            <name>saveConfig</name>\n' +
			'            <value class="SampleSaveConfiguration">\n' +
			'              <time>true</time>\n' +
			'              <latency>true</latency>\n' +
			'              <timestamp>true</timestamp>\n' +
			'              <success>true</success>\n' +
			'              <label>true</label>\n' +
			'              <code>true</code>\n' +
			'              <message>true</message>\n' +
			'              <threadName>true</threadName>\n' +
			'              <dataType>true</dataType>\n' +
			'              <encoding>false</encoding>\n' +
			'              <assertions>true</assertions>\n' +
			'              <subresults>true</subresults>\n' +
			'              <responseData>false</responseData>\n' +
			'              <samplerData>false</samplerData>\n' +
			'              <xml>false</xml>\n' +
			'              <fieldNames>false</fieldNames>\n' +
			'              <responseHeaders>false</responseHeaders>\n' +
			'              <requestHeaders>false</requestHeaders>\n' +
			'              <responseDataOnError>false</responseDataOnError>\n' +
			'              <saveAssertionResultsFailureMessage>false</saveAssertionResultsFailureMessage>\n' +
			'              <assertionsResultsToSave>0</assertionsResultsToSave>\n' +
			'              <bytes>true</bytes>\n' +
			'              <threadCounts>true</threadCounts>\n' +
			'            </value>\n' +
			'          </objProp>\n' +
			'          <stringProp name="filename"></stringProp>\n' +
			'        </ResultCollector>\n' +
			'        <hashTree/>\n' +
			'      </hashTree>\n' +
			'    </hashTree>\n' +
			'  </hashTree>\n' +
			'</jmeterTestPlan>\n';
};

var getSamplerStr = function(sample) {
	var ret = '';
	
	ret += '<HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="'+sample.path+'" enabled="true">\n';
	ret += '  <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">\n';
	ret += '    <collectionProp name="Arguments.arguments">\n';
	
	for(var key in sample.params) {
		if (!sample.params.hasOwnProperty(key)) { continue; }
		
		var  value = sample.params[key];
		ret += '<elementProp name="asdf" elementType="HTTPArgument">\n' +
				'<boolProp name="HTTPArgument.always_encode">true</boolProp>\n' +
				'<stringProp name="Argument.value">'+key+'</stringProp>\n' +
				'<stringProp name="Argument.metadata">=</stringProp>\n' +
				'<boolProp name="HTTPArgument.use_equals">true</boolProp>\n' +
				'<stringProp name="Argument.name">'+encodeURIComponent(value)+'</stringProp>\n' +
				'</elementProp>';
	}
			
		
	ret += '    </collectionProp>\n';
	ret += '  </elementProp>\n';
	ret +='<stringProp name="HTTPSampler.domain">'+sample.host+'</stringProp>\n';
	ret +='<stringProp name="HTTPSampler.port"></stringProp>\n';
	ret += '<stringProp name="HTTPSampler.connect_timeout"></stringProp>\n';
	ret += '<stringProp name="HTTPSampler.response_timeout"></stringProp>\n';
	ret += '<stringProp name="HTTPSampler.protocol">'+sample.scheme+'</stringProp>\n';
	ret += '<stringProp name="HTTPSampler.contentEncoding"></stringProp>\n';
	ret += '<stringProp name="HTTPSampler.path">'+sample.path+'</stringProp>\n';
	ret += '<stringProp name="HTTPSampler.method">'+sample.method+'</stringProp>\n';
	ret += '<boolProp name="HTTPSampler.follow_redirects">true</boolProp>\n';
	ret += '<boolProp name="HTTPSampler.auto_redirects">false</boolProp>\n';
	ret += '<boolProp name="HTTPSampler.use_keepalive">true</boolProp>\n';
	ret += '<boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>\n';
	ret += '<boolProp name="HTTPSampler.monitor">false</boolProp>\n';
	ret += '<stringProp name="HTTPSampler.embedded_url_re"></stringProp>\n';
	ret += '</HTTPSamplerProxy>\n';
	ret += '<hashTree>\n';
	
	ret +='<HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager" enabled="true">\n';
	ret +='	<collectionProp name="HeaderManager.headers">\n';
	
	for (var hkey in sample.reqheader) {
		if (!sample.reqheader.hasOwnProperty(hkey)) { continue; }
		var hvalue = sample.reqheader[hkey];
		ret +='	  <elementProp name="" elementType="Header">';
		ret +='		<stringProp name="Header.name">'+hkey+'</stringProp>\n';
		ret +='		<stringProp name="Header.value">'+hvalue+'</stringProp>\n';
		ret +='	  </elementProp>';
	}
	
	ret +='	</collectionProp>';
	ret +='</HeaderManager>';
	
	ret += '</hashTree>';
	
	return ret;
};

var getScriptData = function(reqList) {
	var ret = getHeaderStr();
	for (var i in reqList) {
		if (!reqList.hasOwnProperty(i)) { continue; }	
		ret += getSamplerStr(reqList[i]);
	}
	ret += getFooterStr();
	return ret;
};

exports.getScriptData = getScriptData;
