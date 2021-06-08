define(["client.property-panel/components/components", "client.property-panel/component-utils", "translator", "require"], function(a, b) {
    var c = window.location.href + "#gradient-cl-about";
    c = c.replace("state/analysis", "state/edit");
        var   e = '<div style="padding: 5px">Developed by: Vighnesh Gawad. For more information contact <a href="mailto:gawadvighnesh@gmail.com" target="_blank">gawadvighnesh@gmail.com</a></div></div><div style="text-align:right; padding-right:5px;"></div>',
        f = {
            template: e,
            controller: ["$scope", function(a) {
                var c = function() {
                    return a.data
                };
                b.defineLabel(a, a.definition, c, a.args.handler), b.defineVisible(a, a.args.handler), b.defineReadOnly(a, a.args.handler), b.defineChange(a, a.args.handler), b.defineValue(a, a.definition, c), a.getDescription = function(a) {
                    return "About" === a
                }
            }]
        };
    return a.addComponent("kpi-about", f), f
});