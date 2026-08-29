---
layout: null
permalink: /__debug_tools/
---
DEBUG_TOOLS_COUNT: {{ site.tools | size }}
{% for t in site.tools %}- TOOL: {{ t.title }} | {{ t.path }} | {{ t.url }}
{% endfor %}
DEBUG_COLLECTIONS:
{% for c in site.collections %}- {{ c.label }}: {{ c.docs.size }}
{% endfor %}