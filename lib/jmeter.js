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
	return	'<ResultCollector guiclass="SummaryReport" testclass="ResultCollector" testname="Summary Report" enabled="true">' +
			'          <boolProp name="ResultCollector.error_logging">false</boolProp>' +
			'          <objProp>' +
			'            <name>saveConfig</name>' +
			'            <value class="SampleSaveConfiguration">' +
			'              <time>true</time>' +
			'              <latency>true</latency>' +
			'              <timestamp>true</timestamp>' +
			'              <success>true</success>' +
			'              <label>true</label>' +
			'              <code>true</code>' +
			'              <message>true</message>' +
			'              <threadName>true</threadName>' +
			'              <dataType>true</dataType>' +
			'              <encoding>false</encoding>' +
			'              <assertions>true</assertions>' +
			'              <subresults>true</subresults>' +
			'              <responseData>false</responseData>' +
			'              <samplerData>false</samplerData>' +
			'              <xml>false</xml>' +
			'              <fieldNames>false</fieldNames>' +
			'              <responseHeaders>false</responseHeaders>' +
			'              <requestHeaders>false</requestHeaders>' +
			'              <responseDataOnError>false</responseDataOnError>' +
			'              <saveAssertionResultsFailureMessage>false</saveAssertionResultsFailureMessage>' +
			'              <assertionsResultsToSave>0</assertionsResultsToSave>' +
			'              <bytes>true</bytes>' +
			'              <threadCounts>true</threadCounts>' +
			'            </value>' +
			'          </objProp>' +
			'          <stringProp name="filename"></stringProp>' +
			'        </ResultCollector>' +
			'        <hashTree/>' +
			'      </hashTree>' +
			'    </hashTree>' +
			'  </hashTree>' +
			'</jmeterTestPlan>';
};

var getSamplerStr = function(sample) {
	var ret = '';
	
	ret += '<HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="'+sample.path+'" enabled="true">';
	ret += '  <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">';
	ret += '    <collectionProp name="Arguments.arguments">';
	
	for(var key in sample.params) {
		if (!sample.params.hasOwnProperty(key)) { continue; }
		
		var  value = sample.params[key];
		ret += '<elementProp name="asdf" elementType="HTTPArgument">' +
				'<boolProp name="HTTPArgument.always_encode">false</boolProp>' +
				'<stringProp name="Argument.value">'+key+'</stringProp>' +
				'<stringProp name="Argument.metadata">=</stringProp>' +
				'<boolProp name="HTTPArgument.use_equals">true</boolProp>' +
				'<stringProp name="Argument.name">'+value+'</stringProp>' +
				'</elementProp>';
	}
			
		
	ret += '    </collectionProp>';
	ret += '  </elementProp>';
	ret +='<stringProp name="HTTPSampler.domain">'+sample.host+'</stringProp>';
	ret +='<stringProp name="HTTPSampler.port"></stringProp>';
	ret += '<stringProp name="HTTPSampler.connect_timeout"></stringProp>';
	ret += '<stringProp name="HTTPSampler.response_timeout"></stringProp>';
	ret += '<stringProp name="HTTPSampler.protocol">'+sample.scheme+'</stringProp>';
	ret += '<stringProp name="HTTPSampler.contentEncoding"></stringProp>';
	ret += '<stringProp name="HTTPSampler.path">'+sample.path+'</stringProp>';
	ret += '<stringProp name="HTTPSampler.method">'+sample.method+'</stringProp>';
	ret += '<boolProp name="HTTPSampler.follow_redirects">true</boolProp>';
	ret += '<boolProp name="HTTPSampler.auto_redirects">false</boolProp>';
	ret += '<boolProp name="HTTPSampler.use_keepalive">true</boolProp>';
	ret += '<boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>';
	ret += '<boolProp name="HTTPSampler.monitor">false</boolProp>';
	ret += '<stringProp name="HTTPSampler.embedded_url_re"></stringProp>';
	ret += '</HTTPSamplerProxy>';
	ret += '<hashTree>';
	
	ret +='<HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager" enabled="true">';
	ret +='	<collectionProp name="HeaderManager.headers">';
	
	for (var hkey in sample.reqheader) {
		if (!sample.reqheader.hasOwnProperty(hkey)) { continue; }
		var hvalue = sample.reqheader[hkey];
		ret +='	  <elementProp name="" elementType="Header">';
		ret +='		<stringProp name="Header.name">'+hkey+'</stringProp>';
		ret +='		<stringProp name="Header.value">'+hvalue+'</stringProp>';
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
