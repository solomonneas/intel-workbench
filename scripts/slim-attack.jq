# Slim the MITRE ATT&CK Enterprise STIX bundle down to the fields the workbench
# needs (id, name, tactic, description, platforms, url). Run with:
#
#   curl -sL https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json \
#     | jq -f scripts/slim-attack.jq > src/data/attack-enterprise.json
#
([.objects[]
  | select(.type == "x-mitre-tactic")
  | {
      shortname: .x_mitre_shortname,
      name: .name,
      id: (.external_references[0].external_id // null)
    }
] | sort_by(.name)) as $tactics
|
([.objects[]
  | select(.type == "attack-pattern")
  | select(.revoked != true)
  | select((.x_mitre_deprecated // false) != true)
  | {
      id: ((.external_references // [])
            | map(select(.source_name == "mitre-attack"))
            | .[0].external_id),
      url: ((.external_references // [])
            | map(select(.source_name == "mitre-attack"))
            | .[0].url),
      name: .name,
      description: ((.description // "")
                     | gsub("\\s+"; " ")
                     | .[0:280]),
      tactics: [(.kill_chain_phases // [])[]
                 | select(.kill_chain_name == "mitre-attack")
                 | .phase_name],
      is_sub: (.x_mitre_is_subtechnique // false),
      platforms: (.x_mitre_platforms // [])
    }
  | select(.id != null)
] | sort_by(.id)) as $techs
|
{
  domain: "enterprise-attack",
  fetched: (now | strftime("%Y-%m-%d")),
  tactics: $tactics,
  techniques: $techs
}
